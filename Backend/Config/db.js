const mongoose = require('mongoose');

// IP Hamachi del servidor
const uri = "mongodb://25.51.24.253:27017/chat"; 

mongoose.connect(uri)
  .then(() => console.log("✅ Conectado a MongoDB vía Hamachi"))
  .catch(err => console.error("❌ Error conectando a MongoDB", err));




  