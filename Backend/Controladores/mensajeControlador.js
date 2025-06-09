const Mensaje = require('../Modelos/mensaje')
const Sesion = require('../Modelos/sesion')

const sendMessage = async (req, res) => {
    try {
        console.log('BODY:', req.body);
        const { nombreSesion, contenido } = req.body;
        const userId = req.user.userId;

        const session = await Sesion.findOne({ nombre: nombreSesion });

        if (!session) return res.status(404).json({ message: "Sesión no encontrada." });

        if (!session.participantes.includes(userId)) return res.status(403).json({ message: "No formas parte de esta sesión." });

         const mensajeNew = new Mensaje({
            sessionId: session._id,
            remitente: userId,
            contenido
        });

        await mensajeNew.save();
        res.status(201).json({ message: "Mensaje enviado.", mensajeNew });

    } catch (err) {
        console.error("Error al enviar mensaje:", err);
        res.status(500).json({ message: "Error del servidor" });
    }
};

const getAllMessageBySession = async (req, res) => {
    try {
        const { nombreSesion } = req.body;
        const userId = req.user.userId;

        if (!nombreSesion) return res.status(400).json({ message: "Falta el nombre de la sesión." });

        const session = await Sesion.findOne({ nombre: nombreSesion });
        if (!session) return res.status(404).json({ message: "Sesión no encontrada." });

        if (!session.participantes.includes(userId)) return res.status(403).json({ message: "No formas parte de esta sesión." });

        const mensajesget = await Mensaje.find({ sessionId: session._id })
            .sort({ timestamp: 1 }) // orden cronológico
            .populate("remitente", "nombre email"); // opcional
        
        res.status(200).json(mensajesget);

    } catch (err) {
        console.error("Error al obtener mensajes:", err);
        res.status(500).json({ message: "Error del servidor" });
    }
};

module.exports = 
{
    sendMessage,
    getAllMessageBySession
}