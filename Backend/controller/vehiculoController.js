// Rutas de escucha (endpoint) disponibles para VEHICULOS
require('rootpath')();
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const vehiculo_db = require("model/vehiculo.js");

const auth = require("config/auth.js");
// Rutas
app.get('/', auth.verificarToken, getAll);
app.post('/', create);
app.put('/:id_vehiculo', update);
app.delete('/:id_vehiculo', deleteVehiculo);
app.get('/:id_vehiculo', getBymatricula);

// Funciones utilizadas en endpoints

function getAll(req, res) {
    vehiculo_db.getAll((err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(resultado);
        }
    });
}

function create(req, res) {
    let vehiculo = req.body;
    vehiculo_db.create(vehiculo, (err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(resultado);
        }
    });
}

function update(req, res) {
    let vehiculo = req.body;
    let id_vehiculo = req.params.id_vehiculo;
    vehiculo_db.update(vehiculo, id_vehiculo, (err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(resultado);
        }
    });
}

function deleteVehiculo(req, res) {
    let id_vehiculo = parseInt(req.params.id_vehiculo);
    console.log(id_vehiculo,'aqui')
    vehiculo_db.deleteVehiculo(id_vehiculo, (err, resultModel) => {
        if (err) {

                res.status(500).send(err);
            
        }

        else {
            if (resultModel.detail.affectedRows == 0) {
                res.status(404).send(resultModel.message);
            } else {
                res.send(resultModel); 
            }
        }
    });
}

function getBymatricula(req, res) {
    let placa = req.params.placa;
    vehiculo_db.getByPlaca(placa, (err, resultModel) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(resultModel);
        }
    });
}

module.exports = app;
