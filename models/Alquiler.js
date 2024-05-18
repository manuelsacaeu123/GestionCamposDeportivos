const mongoose = require('mongoose');

const alquilerSchema = new mongoose.Schema({
  cliente: String,
  carnet: Number,
  nombrecancha: String,
  fechaSolicitud: Date,
  fecha_hora_inicio: Date,
  fecha_hora_fin: Date,  
  precio: Number,
  duracion: Number,
  estado: String,
  empleadoAtencion: String,
  detalle: String
});

module.exports = mongoose.model('Alquiler', alquilerSchema, 'alquiler');





