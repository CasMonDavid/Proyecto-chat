const express = require("express");
const cors = require("cors");
const http = require("http");
require("dotenv").config();
require("./Config/db"); // Aquí ya estás usando la IP Hamachi en MongoDB
const Sesion = require("./Modelos/sesion"); // Importa el modelo de sesión


const ipHamachi = "25.5.28.176"; // IP Hamachi del servidor
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

    // Evento para obtener todas las salas
  socket.on("obtener_salas", async () => {
    try {
      const sesiones = await Sesion.find({}, "nombre"); // Solo el campo nombre
      const nombres = sesiones.map(s => s.nombre);
      socket.emit("salas_existentes", nombres);
    } catch (err) {
      console.error("Error obteniendo salas:", err);
      socket.emit("salas_existentes", []);
    }
  });

  // Evento para crear una sala
  socket.on("crear_sala", async (nombreSala) => {
    try {
      // Verifica si ya existe
      let sesion = await Sesion.findOne({ nombre: nombreSala });
      if (!sesion) {
        sesion = new Sesion({ nombre: nombreSala, participantes: [] });
        await sesion.save();
      }
      io.emit("sala_creada", nombreSala);
    } catch (err) {
      console.error("Error creando sala:", err);
    }
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
