const express = require("express");
const cors = require("cors");
const http = require("http");
require("dotenv").config();
require("./Config/db"); // Aquí ya estás usando la IP Hamachi en MongoDB

const ipHamachi = "25.51.24.253"; // IP Hamachi del servidor
const port = process.env.PORT || 3001;

const app = express();
const server = http.createServer(app);

const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: `http://${ipHamachi}:3000`, // Permitir conexiones desde frontend remoto
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("🔌 Usuario conectado:", socket.id);

  socket.on("joinRoom", (roomName) => {
    socket.join(roomName);
    console.log(`🟢 Usuario ${socket.id} se unió a la sala: ${roomName}`);
  });

  socket.on("nuevo_mensaje", (data) => {
    const { roomName, mensaje } = data;
    console.log(`💬 Mensaje en ${roomName}: ${mensaje.content}`);
    socket.to(roomName).emit("recibir_mensaje", mensaje);
  });

  socket.on("disconnect", () => {
    console.log("❌ Usuario desconectado:", socket.id);
  });
});

const corsOptions = {
  origin: `http://${ipHamachi}:3000`, // Frontend conectado a través de Hamachi
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.use(express.json());

// Rutas
const usuariosRutas = require("./Rutas/usuarioRutas");
app.use("/api/usuarios", usuariosRutas);

const sesionesRutas = require("./Rutas/sesionRutas");
app.use("/api/sesiones", sesionesRutas);

const MensajesRutas = require('./Rutas/mensajeRutas');
app.use("/api/mensajes", MensajesRutas);

// Escuchar en todas las interfaces (incluyendo Hamachi)
server.listen(port, "0.0.0.0", () => {
  console.log(`✅ Servidor corriendo en http://${ipHamachi}:${port}`);
});
