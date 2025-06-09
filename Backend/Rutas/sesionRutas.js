const express = require("express");
const router = express.Router();
const { createSession, addParticipant, searchSession } = require('../Controladores/sesionControlador')
const auth = require('../Middleware/auth');
const removeParticipant = require('../Controladores/sesionControlador').removeParticipant; 

router.post("/crear", auth, createSession);
router.post("/add-usuario", auth, addParticipant);
router.post("/remove-usuario", auth, removeParticipant);

router.get("/buscar", auth, searchSession);

module.exports = router;
