// Importar las dependencias necesarias
require('rootpath')();
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Reemplaza "model/viaje.js" con la ubicación correcta de tu módulo de base de datos para la tabla VIAJE
var viaje_db = require("model/viaje.js");

// Rutas de escucha (endpoints) disponibles para VIAJE
app.get('/', getAllViajes);
app.post('/', crearViaje);
app.put('/:id_viaje', actualizarViaje);
app.delete('/:id_viaje', borrarViaje);
app.get('/:id_viaje', getViajeById);

// Funciones utilizadas en los endpoints

function getAllViajes(req, res) {
    viaje_db.getAllViajes(function (err, resultado) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(resultado);
        }
    });
}

function crearViaje(req, res) {
    let viaje = req.body;
    viaje_db.crearViaje(viaje, (err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(resultado);
        }
    });
}

function actualizarViaje(req, res) {
    let viaje = req.body;
    let id_viaje = req.params.id_viaje;
    viaje_db.actualizarViaje(viaje, id_viaje, (err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(resultado);
        }
    });
}

function borrarViaje(req, res) {
    let id_viaje = req.params.id_viaje;
    viaje_db.borrarViaje(id_viaje, (err, result_model) => {
        if (err) {
            res.status(500).send(err);
        } else {
            if (result_model.detail.affectedRows == 0) {
                res.status(404).send(result_model.message);
            } else {
                res.send(result_model.message);
            }
        }
    });
}

function getViajeById(req, res) {
    let id_viaje = req.params.id_viaje;
    viaje_db.getViajeById(id_viaje, (err, result_model) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(result_model);
        }
    });
}

// Exportar la aplicación Express
module.exports = app;
