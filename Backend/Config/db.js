const mongoose = require('mongoose');

mongoose.connect('mongodb://25.2.232.183:27017/chat', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ Conectado a MongoDB"))
.catch(err => console.error("❌ Error al conectar:", err));