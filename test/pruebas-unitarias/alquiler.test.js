const express = require('express');
const request = require('supertest');

const alquileraRutas = require('../../rutas/alquilerRutas');
const AlquilerModel = require('../../models/Alquiler');

const mongoose = require('mongoose');
const Alquiler = require('../../models/Alquiler');

const app = express();

app.use(express.json());
app.use('/alquileres', alquileraRutas);

//describir un bloque de test
describe('Prueba unitaria para alquileres', () => {
    //se ejecutaantes de iniciar las pruebas

    beforeAll(async () => {
        //conexion con mongo

        await mongoose.connect('mongodb://127.0.0.1:27017/appCamposDeportivos', {
            useNewUrlParser: true
        });
        await AlquilerModel.deleteMany({})
    });

    //al finalizar las pruebas
    afterAll(() => {
        return mongoose.connection.close();
    });


    //PRIMER TEST
    test('Deberia traer todas ls alquileres : GET: getAlquileres', async () => {
        await AlquilerModel.create({
            Cliente: 'Manuel',
            carnet: 7367215,
            nombrecancha: 'A',
            fechaSolicitud: '2024-05-15T00:00:00.000+00:00',
            fecha_hora_inicio: '2024-05-15T10:00:00.000+00:00',
            fecha_hora_fin: '2024-05-15T12:00:00.000+00:00',
            precio: 45,
            duracion: 2,
            estado: 'alquiler',
            empleadoAtencion: 'Juanito',
            detalle: 'ninguno'
        }),
            await AlquilerModel.create({
                Cliente: 'Manuel',
                carnet: 7367215,
                nombrecancha: 'A',
                fechaSolicitud: '2024-05-15T00:00:00.000+00:00',
                fecha_hora_inicio: '2024-05-15T10:00:00.000+00:00',
                fecha_hora_fin: '2024-05-15T12:00:00.000+00:00',
                precio: 45,
                duracion: 2,
                estado: 'alquiler',
                empleadoAtencion: 'Juanito',
                detalle: 'ninguno'
            })

        //solicitud o request
        const res = await request(app).get('/alquileres/getAlquileres');
        //verificar la respuesta
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveLength(2);
    }, 10000);


    test('deberia agregar un nuevo alquiler: POST: /CREAR', async () => {
        const nuevoAlquiler = {
            Cliente: 'Manuel 2',
            carnet: 123,
            nombrecancha: 'B',
            fechaSolicitud: '2024-05-18T00:00:00.000+00:00',
            fecha_hora_inicio: '2024-05-18T10:00:00.000+00:00',
            fecha_hora_fin: '2024-05-18T12:00:00.000+00:00',
            precio: 50,
            duracion: 2,
            estado: 'alquiler',
            empleadoAtencion: 'Juanito 2',
            detalle: 'ninguno'
        };

        const res = await request(app)
            .post('/alquileres/crear')
            .send(nuevoAlquiler);
        expect(res.statusCode).toEqual(201);
        expect(res.body.cliente).toEqual(nuevoAlquiler.cliente);

        test('deberia actualizar una tarea que ya existe', async ()=>{
            const alquiler = AlquilerModel
        })

    });
});