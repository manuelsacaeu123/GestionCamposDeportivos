const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

// Lista negra para tokens
const tokenBlacklist = new Set();

const autenticar = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ mensaje: 'No existe el token de autenticación' });
        }

        // Verificar si el token está en la lista negra
        if (tokenBlacklist.has(token)) {
            return res.status(401).json({ mensaje: 'Token inválido' });
        }

        const decodificar = jwt.verify(token, 'clave_secreta');
        req.usuario = await Usuario.findById(decodificar.usuarioId);
        next();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const invalidarToken = (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
        tokenBlacklist.add(token);
        return res.json({ mensaje: 'Sesión cerrada exitosamente' });
    }
    res.status(400).json({ mensaje: 'No se proporcionó un token' });
};

module.exports = { autenticar, invalidarToken };
