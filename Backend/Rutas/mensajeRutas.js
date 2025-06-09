const express = require("express");
const router = express.Router();
const auth = require('../Middleware/auth')
const { sendMessage, getAllMessageBySession } = require('../Controladores/mensajeControlador')

router.post("/enviar", auth, sendMessage);

router.get("/sesion", auth, getAllMessageBySession);

module.exports = router;