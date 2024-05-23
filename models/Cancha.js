const { decrypt } = require('dotenv');
const mongoose = require('mongoose');

//esquema para la cancha
const canchaSchema = new mongoose.Schema({
    nombreCancha: String,
    precioXhora: Number,
    estado: Boolean,
    tipoUso : String
});

// Exportar el modelo 'Cancha' basado en el esquema 'canchaSchema'
module.exports = mongoose.model('Cancha', canchaSchema, 'cancha');
