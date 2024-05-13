const express = require('express');
const moment = require('moment');
const router = express.Router();
const Alquiler = require('../models/Alquiler');
//CREATE
router.post('/crear', async (req, res) => {
    try {
        const nuevoAlquiler = new Alquiler({
            cliente: req.body.cliente,
            carnet: req.body.carnet, 
            nombrecancha: req.body.nombrecancha,
            fechaSolicitud: req.body.fechaSolicitud,
            fecha_hora_inicio: req.body.fecha_hora_inicio,
            fecha_hora_fin: req.body.fecha_hora_fin,
            precio: req.body.precio,
            duracion: req.body.duracion,
            estado: req.body.estado,
            empleadoAtencion: req.body.empleadoAtencion,
            detalle: req.body.detalle
        });

        const alquilerGuardado = await nuevoAlquiler.save();

        res.status(201).json(alquilerGuardado);
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
});


//READ 
// Obtener todos los alquileres
router.get('/getAlquileres', async (req, res) => {
    try  {
        const alquileres = await Alquiler.find();
        res.json(alquileres);
    } catch (error){
        res.status(500).json({ mensaje: error.message });
    }
});

// Obtener un alquiler por su ID
router.get('/getAlquiler/:id', async (req, res) => {
    try {
        const alquiler = await Alquiler.findById(req.params.id);
        if (!alquiler)
            return res.status(404).json({ mensaje: 'Alquiler no encontrado' });
        res.json(alquiler);
    } catch(error) {
        res.status(500).json({ mensaje: error.message });
    }
});

//UPDATE
//actualizar uno o varios campos por el id
router.put('/editar/:id', async (req, res) => {
    try {
        const alquilerEditado = await Alquiler.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!alquilerEditado)
            return res.status(404).json({ mensaje: 'Alquiler no encontrado' });
        res.json(alquilerEditado);
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
});

//DELETE
//eleminar por el id
router.delete('/eliminar/:id', async (req, res) => {
    try {
        const alquilerEliminado = await Alquiler.findByIdAndDelete(req.params.id);
        if (!alquilerEliminado)
            return res.status(404).json({ mensaje: 'Alquiler no encontrado' });
        res.json({ mensaje: 'Alquiler eliminado' });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});


//CONSULTAS AVANZADAS 
//1
//Mostrar todos los alquileres seleccionando el  estado (Alquiler, reserva, Cancelado) en un año especifico 
router.get('/alquileresPorEstado/:estado/:anio', async (req, res) => {
    try {
        const estado = req.params.estado;
        const anio = req.params.anio;
        const fechaInicioAnio = new Date(anio, 0, 1); 
        const fechaFinAnio = new Date(anio, 11, 31, 23, 59, 59); 
        const alquileres = await Alquiler.find({
            estado: estado,
            fecha_hora_inicio: { $gte: fechaInicioAnio },
            fecha_hora_fin: { $lte: fechaFinAnio }
        });

        res.status(200).json(alquileres);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

//2 Obtener el total de ganancias EN UNA CANCHA ESPECIFICA DENTRO DE UN RANGO DE FECHAS
router.get('/gananciasXCancha/:nombreCancha/:fechaInicio/:fechaFin', async (req, res) => {
    try {
       
        const nombreCancha = req.params.nombreCancha;
        const fechaInicio = new Date(req.params.fechaInicio);
        const fechaFin = new Date(req.params.fechaFin);
 const alquileres = await Alquiler.find({
            nombrecancha: nombreCancha,
            fecha_hora_inicio: { $gte: fechaInicio },
            fecha_hora_fin: { $lte: fechaFin }
        });

        let gananciasTotales = 0;
        for (const alquiler of alquileres) {
            gananciasTotales += alquiler.precio;
        }
        res.status(200).json({ gananciasTotales });
    } catch (error) {
        // Manejar errores
        res.status(500).json({ mensaje: error.message });
    }
});
 
//3 ELIMINAR TODOS ALQUILERES CON ESTADO= "CANCELADO" Y SI YA PASO MAS DE UN AÑO

router.delete('/eliminarAlquileresCanceladosAntiguos', async (req, res) => {
    try {

        const fechaActual = new Date();
        // la fecha de hace un año es..
        const fechaHaceUnAnio = moment(fechaActual).subtract(1, 'years').toDate();
        const alquileresAntiguos = await Alquiler.find({
            estado: "Cancelado",
            fecha_hora_inicio: { $lte: fechaHaceUnAnio }
        });
        // Eliminar 
        for (const alquiler of alquileresAntiguos) {
            await Alquiler.findByIdAndDelete(alquiler._id);
        }
        res.status(200).json({ mensaje: "Alquileres cancelados fueron eliminados correctamente" });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

//4 TODOS LOS ALQUILERES REALIZADOS POR UN CLIENTE Y EN QUE CANCHAS
router.get('/alquileresXCliente/:carnetCliente', async (req, res) => {
    try {
        
        const carnetCliente = req.params.carnetCliente;
        const alquileresCliente = await Alquiler.find({
            carnet: carnetCliente
        });
        const resultados = [];
        for (const alquiler of alquileresCliente) {
            resultados.push({
                cliente: alquiler.cliente,
                nombrecancha: alquiler.nombrecancha,
                fecha_hora_inicio: alquiler.fecha_hora_inicio,
                fecha_hora_fin: alquiler.fecha_hora_fin
            });
        }

        res.status(200).json(resultados);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});
 
//5 TOTAL DE GANANCIAS POR CANCHAS
router.get('/gananciasPorCancha', async (req, res) => {
    try {
        const gananciasPorCancha = await Alquiler.aggregate([
            {
                $match: { estado: "Alquiler" } 
            },
            {
                $group: {
                    _id: "$nombrecancha",
                    totalGanancias: { $sum: "$precio" }
                }
            }
        ]);


        res.status(200).json(gananciasPorCancha);
    } catch (error) {

        res.status(500).json({ mensaje: error.message });
    }
});

//6 ACTUALIZAR INFORMACION DEL CLIENTE DE TODOS LOS ALQUILERS FILTRANDO POR CARNET
router.put('/actualizarCliente/:carnet', async (req, res) => {
    try {
        const carnet = req.params.carnet;
        const nuevoNombre = req.body.nuevoNombre;
        const nuevoCarnet = req.body.nuevoCarnet;

        // Actualizar la información del cliente en todos los alquileres asociados al carné
        const resultado = await Alquiler.updateMany(
            { carnet: carnet },
            { $set: { cliente: nuevoNombre, carnet: nuevoCarnet } }
        );

        res.status(200).json({ mensaje: 'Corregido' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ mensaje: 'Error' });
    }
});

 
//7 OBTENER EL CLIENTE CON MAS HORAS DE ALQUILER
router.get('/clienteConMasHorasAlquiler', async (req, res) => {
    try {
        const resultado = await Alquiler.aggregate([
            {
                $group: {
                    _id: "$carnet",
                    nombreCliente: { $first: "$cliente" },
                    totalHoras: { $sum: "$duracion" }
                }
            },
            { $sort: { totalHoras: -1 } },
            { $limit: 1 }
        ]);

        if (resultado.length === 0) {
            return res.status(404).json({ mensaje: 'No se encontraron alquileres' });
        }

        res.status(200).json(resultado[0]);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});


module.exports = router;
