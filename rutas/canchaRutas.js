const express = require('express');
const router = express.Router();
const Cancha = require('../models/Cancha');


// CREATE
router.post('/crearCancha', async (req, res) => {
    try {
        const nuevaCancha = new Cancha({
            nombreCancha: req.body.nombreCancha,
            precioXhora: req.body.precioXhora,
            estado: req.body.estado,
            descripcion: req.body.descripcion
        });

        const canchaGuardada = await nuevaCancha.save();
        res.status(201).json(canchaGuardada);
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
});

// READ
// Obtener todas las canchas
router.get('/getCanchas', async (req, res) => {
    try {
        const canchas = await Cancha.find();
        res.json(canchas);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

// Obtener una cancha por su ID
router.get('/getCancha/:id', async (req, res) => {
    try {
        const cancha = await Cancha.findById(req.params.id);
        if (!cancha) {
            return res.status(404).json({ mensaje: 'Cancha no encontrada' });
        }
        res.json(cancha);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

// UPDATE
// Actualizar uno o varios campos por el id
router.put('/editarCancha/:id', async (req, res) => {
    try {
        const canchaEditada = await Cancha.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!canchaEditada) {
            return res.status(404).json({ mensaje: 'Cancha no encontrada' });
        }
        res.json(canchaEditada);
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
});

// DELETE
// Eliminar por el id
router.delete('/eliminarCancha/:id', async (req, res) => {
    try {
        const canchaEliminada = await Cancha.findByIdAndDelete(req.params.id);
        if (!canchaEliminada) {
            return res.status(404).json({ mensaje: 'Cancha no encontrada' });
        }
        res.json({ mensaje: 'Cancha eliminada' });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});



module.exports = router;
