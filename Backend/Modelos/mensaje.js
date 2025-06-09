const mongoose = require("mongoose");

const mensajeEsquema = new mongoose.Schema({
    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sesiones",
        required: true
    },
    remitente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuarios",
        required: true
    },
    contenido: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Mensajes", mensajeEsquema);