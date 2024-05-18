const express = require('express');
const mongoose = require('mongoose');

const jwt = require('jsonwebtoken');

const authRutas = require('./rutas/authRutas')
const  Usuario = require('./models/Usuario');

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
//app.use('/alquileres', alquilerRutas);

//funcion para auteticar
const autenticar = async (req, res, next)=>{
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token)
            res.status(401).json({mensaje: 'No existe el token de autenticacion'});
        const decodificar = jwt.verify(token, 'clave_secreta');
        req.usuario = await  Usuario.findById(decodificar.usuarioId);
        next();
    }
    catch(error){
        res.status(400).json({ error: error.message});
    }
};


app.use('/auth', authRutas);
app.use('/alquileres/', autenticar, alquilerRutas);

module.exports = app;
