const express = require("express");
const router = express.Router();
const { createSession, addParticipant, searchSession } = require('../Controladores/sesionControlador')
const auth = require('../Middleware/auth');

router.post("/crear", auth, createSession);
router.post("/add-usuario", auth, addParticipant);

router.get("/buscar", auth, searchSession);

module.exports = router;
