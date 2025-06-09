const Sesion = require('../Modelos/sesion');

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

module.exports = { createSession };