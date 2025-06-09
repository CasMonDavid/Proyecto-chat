const express = require("express");
const cors = require("cors");
const http = require("http");
const path = require("path");
require("dotenv").config();
require("./Config/db");
const port = process.env.PORT || 3001;

const app = express();
const server = http.createServer(app);

const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Cambia si usas otro frontend
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("🔌 Usuario conectado:", socket.id);

  // Unirse a una sala (sesión de chat)
  socket.on("joinRoom", (roomName) => {
    socket.join(roomName);
    console.log(`🟢 Usuario ${socket.id} se unió a la sala: ${roomName}`);
  });

  // Recibir y reenviar mensajes
  socket.on("nuevo_mensaje", (data) => {
    const { roomName, mensaje } = data;
    console.log(`💬 Mensaje en ${roomName}: ${mensaje.content}`);

    // Enviar a todos menos al emisor
    socket.to(roomName).emit("recibir_mensaje", mensaje);
  });

  // Desconexión
  socket.on("disconnect", () => {
    console.log("❌ Usuario desconectado:", socket.id);
  });
});

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.use(express.json());

// rutas
const usuariosRutas = require("./Rutas/usuarioRutas");
app.use("/api/usuarios", usuariosRutas);

const sesionesRutas = require("./Rutas/sesionRutas")
app.use("/api/sesiones", sesionesRutas);

const MensajesRutas = require('./Rutas/mensajeRutas')
app.use("/api/mensajes", MensajesRutas)

server.listen(port, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${port}`);
});
