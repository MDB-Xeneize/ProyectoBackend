// Rutas de escucha (endpoint) disponibles para GESTIONA
require('rootpath')();
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Reemplaza "model/gestiona.js" con la ubicación correcta de tu módulo de base de datos para la tabla GESTIONA
const gestiona_db = require("model/gestiona.js");

// Rutas
app.get('/', getAllGestiona);
app.post('/', createGestiona);
app.put('/:id_viaje/:id_usuario', updateGestiona);
app.delete('/:id_viaje/:id_usuario', deleteGestiona);
app.get('/:id_viaje/:id_usuario', getGestiona);

// Funciones utilizadas en endpoints

function getAllGestiona(req, res) {
    gestiona_db.getAllGestiona((err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(resultado);
        }
    });
}

function createGestiona(req, res) {
    let gestion = req.body;
    gestiona_db.createGestiona(gestion, (err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(resultado);
        }
    });
}

function updateGestiona(req, res) {
    let gestion = req.body;
    let id_viaje = req.params.id_viaje;
    let id_usuario = req.params.id_usuario;
    gestiona_db.updateGestiona(gestion, id_viaje, id_usuario, (err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(resultado);
        }
    });
}

function deleteGestiona(req, res) {
    let id_viaje = req.params.id_viaje;
    let id_usuario = req.params.id_usuario;
    gestiona_db.deleteGestiona(id_viaje, id_usuario, (err, resultModel) => {
        if (err) {
            res.status(500).send(err);
        } else {
            if (resultModel.detail.affectedRows == 0) {
                res.status(404).send(resultModel.message);
            } else {
                res.send(resultModel.message);
            }
        }
    });
}

function getGestiona(req, res) {
    let id_viaje = req.params.id_viaje;
    let id_usuario = req.params.id_usuario;
    gestiona_db.getGestiona(id_viaje, id_usuario, (err, resultModel) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(resultModel);
        }
    });
}

module.exports = app;