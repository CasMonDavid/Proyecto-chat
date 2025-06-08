// test/createUser.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../Modelos/usuario');


mongoose.connect('mongodb://localhost:27017/chatdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(async () => {
    const hashedPassword = await bcrypt.hash("123456789", 10);
    const newUser = new User({
        nombre: "David",
        contrasenna: hashedPassword,
        email: "david@email.com"
    });

    await newUser.save();
    console.log("✅ Usuario guardado");
    mongoose.disconnect();
})
.catch(err => console.error("❌ Error:", err));
