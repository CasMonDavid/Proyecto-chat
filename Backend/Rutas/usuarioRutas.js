const express = require("express");
const router = express.Router();
const { createUser } = require('../Controladores/usuarioControlador');

router.post("/registrar",createUser);

module.exports = router;