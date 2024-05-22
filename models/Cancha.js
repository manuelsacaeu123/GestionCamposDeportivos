const mongoose = require('mongoose');

//esquema para la cancha
const canchaSchema = new mongoose.Schema({
    nombreCancha: String,
    precioXhora: Number,
    estado: Boolean,
});

// Exportar el modelo 'Cancha' basado en el esquema 'canchaSchema'
module.exports = mongoose.model('Cancha', canchaSchema, 'cancha');
