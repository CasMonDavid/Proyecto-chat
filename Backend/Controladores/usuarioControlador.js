const Usuario = require('../Modelos/usuario');
const bcrypt = require('bcrypt');

const createUser = async (req, res) => {
    try {
        const { nombre, contrasenna, email } = req.body;

        if (!nombre || !email || !contrasenna) {
            return res.status(400).json({ message: "Todos los campos son obligatorios." });
        };

        const userExists = await Usuario.findOne({ $or: [{ nombre }, { email }] });
        if (userExists) {
            return res.status(409).json({ message: "El usuario o correo ya está en uso." });
        };

        const hashedPassword = await bcrypt.hash(contrasenna, 10);

        const newUser = new Usuario({
            nombre,
            email,
            contrasenna: hashedPassword,
        });

        await newUser.save();

        res.status(201).json({ message: "Usuario registrado correctamente." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error del servidor.", error: err });
    };
};

module.exports = { createUser };