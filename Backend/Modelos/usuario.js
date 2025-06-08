const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true },
  contrasenna: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  registro: { type: Date, default: Date.now }
});

const User = mongoose.model('Usuarios', userSchema);
module.exports = User;