const express = require("express");
const router = express.Router();
const { createUser, loginUser } = require('../Controladores/usuarioControlador');
const auth = require("../Middleware/auth");

///router.post("/enviarMensaje", auth, enviarMensaje); Ejemplo de uso del miffleware

router.post("/registrar",createUser);
router.post("/login", loginUser);

module.exports = router;