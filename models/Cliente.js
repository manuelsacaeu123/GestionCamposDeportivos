const mongoose = require('mongoose');

// Definir el esquema para el cliente
const clienteSchema = new mongoose.Schema({
    nombreCliente: String,
    carnet: Number,
    celular: Number
});

// Exportar el modelo 'Cliente' basado en el esquema 'clienteSchema'
module.exports = mongoose.model('Cliente', clienteSchema, 'cliente');
