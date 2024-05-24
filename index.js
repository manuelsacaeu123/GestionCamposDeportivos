const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const authRutas = require('./rutas/authRutas');
const alquilerRutas = require('./rutas/alquilerRutas');
const clienteRutas = require('./rutas/clienteRutas');
const canchaRutas = require('./rutas/canchaRutas');
const { autenticar, invalidarToken } = require('./middlewares/autenticar');

require('dotenv').config();
const app = express();

// Configuraciones de entorno
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// Manejo de JSON
app.use(express.json());

// Conexión con MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Conexión exitosa a MongoDB');
        app.listen(PORT, () => {
            console.log(`Servidor express corriendo en el puerto: ${PORT}`);
        });
    })
    .catch(error => console.log('Error de conexión a MongoDB:', error));

// Rutas
app.use('/auth', authRutas);
app.use('/alquileres', autenticar, alquilerRutas);
app.use('/canchas', autenticar, canchaRutas);
app.use('/clientes', autenticar, clienteRutas);

// Ruta para cerrar sesión
app.post('/cerrarsesion', invalidarToken);

module.exports = app;
