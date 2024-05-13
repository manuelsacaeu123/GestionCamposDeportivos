const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();

// Rutas
const alquilerRutas = require('./rutas/alquilerRutas');

// Configuraciones de entorno
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// Manejo de JSON
app.use(express.json());

// Conexión con MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Conexión exitosa a MongoDB');
        // Iniciar el servidor después de la conexión exitosa
        app.listen(PORT, () => {
            console.log(`Servidor express corriendo en el puerto: ${PORT}`);
        });
    })
    .catch(error => console.log('Error de conexión a MongoDB:', error));

// Utilizar las rutas de alquiler
app.use('/alquileres', alquilerRutas);

module.exports = app;
