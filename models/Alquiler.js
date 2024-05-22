const mongoose = require('mongoose');

const alquilerSchema = new mongoose.Schema({ 

  descrEstado: String,
  descrTipoUso: String,
  fechaSolicitud: Date,
  fecha_hora_inicio: Date,
  fecha_hora_fin: Date,  
  montototal: Number,
  duracion: Number,
  
  cliente: {
    type: mongoose.Schema.Types.ObjectId, ref: 'Cliente'
  },
  cancha: {
    type: mongoose.Schema.Types.ObjectId, ref: 'Cancha'
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId, ref: 'Usuario'
  }
});

module.exports = mongoose.model('Alquiler', alquilerSchema, 'alquiler');





