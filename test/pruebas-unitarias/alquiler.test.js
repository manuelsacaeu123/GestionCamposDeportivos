const express = require('express');
const request = require('supertest');
const moment = require('moment');


const mongoose = require('mongoose');

const ClienteModel = require('../../models/Cliente');

const CanchaModel = require('../../models/Cancha');
const alquileraRutas = require('../../rutas/alquilerRutas');
const AlquilerModel = require('../../models/Alquiler');
const app = express();

app.use(express.json());
app.use('/alquileres', alquileraRutas);

//describir un bloque de test

describe('Prueba unitaria para alquileres', () => {
    let createdCanchaId;
    let createdClienteId;
    let year = 2024; // Definir el año

    beforeAll(async () => {
        // Conexión con la base de datos
        await mongoose.connect('mongodb://127.0.0.1:27017/appCamposDeportivos', {
            useNewUrlParser: true
        });

        // LIMPIAR LAS COLECCIONES
        await AlquilerModel.deleteMany({});
        await CanchaModel.deleteMany({});
        await ClienteModel.deleteMany({});
    });

    afterAll(async () => {
        // Cierra la conexión con la base de datos al finalizar las pruebas
        await mongoose.connection.close();
    });

    test('Debería traer todos los alquileres realizados en una cancha específica y en un año específico', async () => {
        // Crea primero los documentos de Cancha y Cliente necesarios
        const createdCancha = await CanchaModel.create({
            nombreCancha: 'CANCHA PRUEBA',
            precioXhora: 50,
            estado: true,
            tipoUso: 'Tipo de Uso'
        });

        const createdCliente = await ClienteModel.create({
            nombreCliente: 'CLIENTE PRUEBA',
            carnet: 10,
            celular: 222
        });

        // Guarda los IDs de Cancha y Cliente creados
        createdCanchaId = createdCancha._id;
        createdClienteId = createdCliente._id;
        
        // Crear fechas en formato adecuado
        const fechaSolicitud = new Date(`${year}-05-25T08:00:00.000Z`);
        const fechaInicio = new Date(`${year}-05-25T10:00:00.000Z`);
        const fechaFin = new Date(`${year}-05-25T12:00:00.000Z`);

        // Crea el documento de Alquiler con referencias a Cancha y Cliente
        await AlquilerModel.create({
            descrEstado: 'ALQUILER',
            descrTipoUso: 'ALQUILER prueba',
            fechaSolicitud: fechaSolicitud,
            fecha_hora_inicio: fechaInicio,
            fecha_hora_fin: fechaFin,
            montototal: 250,
            duracion: 7,
            cliente: createdClienteId,
            cancha: createdCanchaId
        });

        // Realiza la solicitud GET al endpoint /alquileresXcancha/:canchaId/:anio
        const res = await request(app).get(`/alquileres/alquileresXcancha/${createdCanchaId}/${year}`);
        
        // Verifica la respuesta
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('DATOS_CANCHA');
        expect(res.body.DATOS_CANCHA).toHaveProperty('nombreCancha');
        expect(res.body).toHaveProperty('ALQUILER');
        expect(res.body.ALQUILER).toHaveLength(1);
        expect(res.body.ALQUILER[0]).toHaveProperty('Tipo');
        expect(res.body.ALQUILER[0]).toHaveProperty('Uso');
        expect(res.body.ALQUILER[0]).toHaveProperty('Fecha_Hora_Inicio');
        expect(res.body.ALQUILER[0]).toHaveProperty('Fecha_Hora_Fin');
        expect(res.body.ALQUILER[0]).toHaveProperty('Total_Bs');
        expect(res.body.ALQUILER[0]).toHaveProperty('Duracion');
        expect(res.body.ALQUILER[0]).toHaveProperty('DATOS_CLIENTE');
        expect(res.body.ALQUILER[0].DATOS_CLIENTE).toHaveProperty('Nombre');
        expect(res.body.ALQUILER[0].DATOS_CLIENTE).toHaveProperty('Carnet');
        expect(res.body.ALQUILER[0].DATOS_CLIENTE).toHaveProperty('Celular');
    });
});


