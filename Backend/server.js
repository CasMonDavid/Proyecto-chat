// server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./Config/db");

const app = express();
const port = process.env.PORT || 3001;

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

app.listen(port, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${port}`);
});
