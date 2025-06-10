const mongoose = require('mongoose');
require('dotenv').config();

// IP Hamachi del servidor

mongoose.connect(process.env.MONGODB_URI , {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000 // Tiempo de espera para la conexión
})
  .then(() => console.log("✅ Conectado a MongoDB vía Hamachi"))
  .catch(err => console.error("❌ Error conectando a MongoDB", err));




  