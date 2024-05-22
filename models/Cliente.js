const mongoose = require('mongoose');

// Definir el esquema para el cliente
const clienteSchema = new mongoose.Schema({
    nombreCliente: { type: String, required: true },
    carnet: { type: Number, required: true, unique: true },
    celular: { type: Number, required: true }
});

// Exportar el modelo 'Cliente' basado en el esquema 'clienteSchema'
module.exports = mongoose.model('Cliente', clienteSchema, 'cliente');
