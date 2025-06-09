const Usuario = require('../Modelos/usuario');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

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

const loginUser = async (req, res) => {
    try {
        console.log('BODY LOGIN:', req.body);
        console.log('HEADERS:', req.headers);
        const { usernameOrEmail, contrasenna } = req.body;

        if (!usernameOrEmail || !contrasenna) {
            return res.status(400).json({ message: "Todos los campos son obligatorios." });
        }

        // Buscar por nombre de usuario o email
        const user = await Usuario.findOne({
            $or: [
                { nombre: usernameOrEmail },
                { email: usernameOrEmail }
            ]
        });

        if (!user) {
            return res.status(409).json({ message: "Usuario no encontrado." });
        }

        const isMatch = await bcrypt.compare(contrasenna, user.contrasenna);
        if (!isMatch) {
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }

        const token = jwt.sign(
            { userId: user._id, nombre: user.nombre },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({ message: "Login exitoso", token });
    } catch (err) {
        console.error("Error en loginUser:", err);
        res.status(500).json({ message: "Error del servidor", error: err });
    }
};

module.exports =
{
    createUser, 
    loginUser 
};