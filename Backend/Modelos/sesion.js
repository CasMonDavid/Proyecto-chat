// models/Session.js
const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
    nombre: { type: String, default: null },
    participantes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuarios",
        required: true
    }],
    registro: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Sesiones", sessionSchema);
