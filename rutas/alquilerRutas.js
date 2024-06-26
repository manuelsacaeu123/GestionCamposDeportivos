const express = require('express');
const moment = require('moment');
const router = express.Router();

const Alquiler = require('../models/Alquiler');
const UsuarioModel = require('../models/Usuario');
const ClienteModel = require('../models/Cliente');
const CanchaModel = require('../models/Cancha');

//CREATE
router.post('/crearAlquiler', async (req, res) => {
    try {
        // Verificar si el usuario, el cliente y la cancha existen
      //  const usuarioExistente = await UsuarioModel.findById(req.body.usuario);
        const clienteExistente = await ClienteModel.findById(req.body.cliente);
        const canchaExistente = await CanchaModel.findById(req.body.cancha);

        // Si alguno de los documentos no existe, devolver un error
        if (!clienteExistente || !canchaExistente) {
            return res.status(404).json({ mensaje: 'cliente o cancha no encontrados' });
        }

        // Crear un nuevo alquiler utilizando los datos proporcionados en el cuerpo de la solicitud
        const nuevoAlquiler = new Alquiler(req.body);
        const alquilerGuardado = await nuevoAlquiler.save();
        res.status(201).json(alquilerGuardado);
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
});

//READ 
// Obtener todos los alquileres
router.get('/getAlquileres', async (req, res) => {
    try {
        const alquileres = await Alquiler.find();
        res.json(alquileres);
    } catch (error) {
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
    } catch (error) {
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

//REPORTES EXAMEN
//RESERVAS REALIZADAS POR UN CLIENTE (CANCHA, CLIENTE, ALQUILER)

router.get('/reservasXcliente/:id', async (req, res) => {
    const { id: clienteId } = req.params; // Usar destructuring para extraer y renombrar `id` a `clienteId`
    try {
        const cliente = await ClienteModel.findById(clienteId);
        if (!cliente) {
            return res.status(404).json({ mensaje: 'Cliente no encontrado' });
        }
        const alquileres = await Alquiler.find({ cliente: clienteId, descrEstado: 'RESERVA' })
            .populate('cliente')
            .populate('cancha'); 
        const alquileresFormateados = alquileres.map(alquiler => ({
            Tipo: alquiler.descrEstado,
            Uso: alquiler.descrTipoUso,
            Fecha_Hora_Inicio: alquiler.fecha_hora_inicio,
            Fecha_Hora_Fin: alquiler.fecha_hora_fin,
            Total_Bs: alquiler.montototal,
            Duracion: alquiler.duracion,
            DATOS_CANCHA: {
                Cancha: alquiler.cancha.nombreCancha,
                Tipo_de_Uso: alquiler.cancha.tipoUso, 

            }
        }));

        const respuesta = {
            DATOS_CLIENTE: {
                Nombre: cliente.nombreCliente,
                Carnet: cliente.carnet,
                Celular: cliente.celular
            },
            RESERVAS_REALIZADAS: alquileresFormateados
        };

        res.json(respuesta);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

//ALQUILRES REALIZADOS EN UNA CANCHA ESPECIFICA Y EN UN AÑO ESPECIFICO 
router.get('/alquileresXcancha/:canchaId/:anio', async (req, res) => {
    try {
        const { canchaId, anio } = req.params;
        const fechaInicioAnio = new Date(anio, 0, 1); 
        const fechaFinAnio = new Date(anio, 11, 31, 23, 59, 59); 

        const alquileres = await Alquiler.find({
            cancha: canchaId,
            descrEstado: "ALQUILER",
            fecha_hora_inicio: { $gte: fechaInicioAnio },
            fecha_hora_fin: { $lte: fechaFinAnio }
        }).populate('cliente').populate('cancha').sort({ fecha_hora_inicio: 1 });

        const cancha = await CanchaModel.findById(canchaId);

        const reservasFormateadas = alquileres.map(alquiler => ({
            Tipo: alquiler.descrEstado,
            Uso: alquiler.descrTipoUso,
            Fecha_Hora_Inicio: alquiler.fecha_hora_inicio,
            Fecha_Hora_Fin: alquiler.fecha_hora_fin,
            Total_Bs: alquiler.montototal,
            Duracion: alquiler.duracion,
            DATOS_CLIENTE: {
                Nombre: alquiler.cliente.nombreCliente,
                Carnet: alquiler.cliente.carnet,
                Celular: alquiler.cliente.celular
            }
        }));

        res.status(200).json({ DATOS_CANCHA: cancha, ALQUILER: reservasFormateadas });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});




module.exports = router;
