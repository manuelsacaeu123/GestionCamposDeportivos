const express = require('express');
const router = express.Router();
const Cliente = require('../models/Cliente');

// CREATE
router.post('/crearCliente', async (req, res) => {
    try {
        const nuevoCliente = new Cliente({
            nombreCliente: req.body.nombreCliente,
            carnet: req.body.carnet,
            celular: req.body.celular
        });

        const clienteGuardado = await nuevoCliente.save();
        res.status(201).json(clienteGuardado);
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
});

// READ
// Obtener todos los clientes
router.get('/getClientes', async (req, res) => {
    try {
        const clientes = await Cliente.find();
        res.json(clientes);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

// Obtener un cliente por su ID
router.get('/getCliente/:id', async (req, res) => {
    try {
        const cliente = await Cliente.findById(req.params.id);
        if (!cliente) {
            return res.status(404).json({ mensaje: 'Cliente no encontrado' });
        }
        res.json(cliente);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

// UPDATE
// Actualizar uno o varios campos por el id
router.put('/editarCliente/:id', async (req, res) => {
    try {
        const clienteEditado = await Cliente.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!clienteEditado) {
            return res.status(404).json({ mensaje: 'Cliente no encontrado' });
        }
        res.json(clienteEditado);
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
});

// DELETE
// Eliminar por el id
router.delete('/eliminarCliente/:id', async (req, res) => {
    try {
        const clienteEliminado = await Cliente.findByIdAndDelete(req.params.id);
        if (!clienteEliminado) {
            return res.status(404).json({ mensaje: 'Cliente no encontrado' });
        }
        res.json({ mensaje: 'Cliente eliminado' });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

module.exports = router;
