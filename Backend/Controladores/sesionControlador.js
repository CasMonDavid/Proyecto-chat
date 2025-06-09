const Sesion = require('../Modelos/sesion');
const Usuario = require('../Modelos/usuario');

const createSession = async (req, res) => {
    try {
        const { nombre } = req.body;
        const userId = req.user.userId; // con el middleware

        if (!nombre) return res.status(400).json({ message: "Necesita un nombre la sesión." });
        if (!userId) return res.status(400).json({ message: "Necesita tener una sesión abierta." });

        const nuevaSesion = new Sesion({
            nombre: nombre,
            participantes: [userId]
        });

        await nuevaSesion.save();

        res.status(201).json({ message: "Sesión creada exitosamente", session: nuevaSesion });

    } catch (err) {
        console.error("Error al crear sesión:", err);
        res.status(500).json({ message: "Error del servidor", error: err });
    }
};

const addParticipant = async (req, res) => {
    try {
        const { nombre } = req.body;
        const userId = req.user.userId;

        if (!nombre || !userId) return res.status(400).json({ message: "Nombre y userId son requeridos." });

        const session = await Sesion.findOne({ nombre: nombre })
        if (!session) return res.status(404).json({ message: "Sesión no encontrada." });

        if (session.participantes.includes(userId)) return res.status(400).json({ message: "El usuario ya está en la sesión." });

        session.participantes.push(userId);
        await session.save();

        res.status(200).json({
            message: "Usuario agregado a la sesión.",
            session
        });

    } catch (err) {
        console.error("Error al agregar usuario:", err);
        res.status(500).json({ message: "Error del servidor" });
    }
};

const searchSession = async (req, res) => {
    try {
        const { nombre } = req.query; // <-- Cambia de req.body a req.query

        if (!nombre) return res.status(400).json({ message: "Falta el nombre de la sala." });

        const session = await Sesion.findOne({ nombre });
        if (!session) return res.status(404).json({ message: "Sesión no encontrada." });

        res.status(200).json({ session });
    } catch (err) {
        console.error("Error al buscar sesiones:", err);
        res.status(500).json({ message: "Error del servidor", error: err });
    }
};

const removeParticipant = async (req, res) => {
  try {
    const { nombre } = req.body;
    const userId = req.user.userId;
    const session = await Sesion.findOne({ nombre });
    if (!session) return res.status(404).json({ message: "Sesión no encontrada." });

    session.participantes = session.participantes.filter(id => id.toString() !== userId);
    await session.save();

    res.status(200).json({ message: "Usuario removido de la sesión.", session });
  } catch (err) {
    res.status(500).json({ message: "Error del servidor", error: err });
  }
};

module.exports = 
{
    createSession,
    addParticipant,
    searchSession,
    removeParticipant
};