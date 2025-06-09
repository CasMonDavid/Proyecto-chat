const express = require("express");
const router = express.Router();
const { createSession } = require('../Controladores/sesionControlador')
const auth = require('../Middleware/auth');

router.post("/crear", auth, createSession);

module.exports = router;
