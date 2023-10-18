// Importar las dependencias necesarias
require('rootpath')();
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Reemplaza "model/tipoViaje.js" con la ubicación correcta de tu módulo de base de datos para la tabla TIPO_VIAJE
var tipoViaje_db = require("model/tipo_Viaje.js");


// Rutas de escucha (endpoints) disponibles para TIPO_VIAJE
app.get('/', getAll);
app.post('/', create);
app.put('/:id_tipo', update);
app.delete('/:id_tipo', borrarTipoViaje);
app.get('/:id_tipo', getTipoViajeById);

// Funciones utilizadas en los endpoints

function getAll(req, res) {
    tipoViaje_db.getAll(function (err, resultado) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(resultado);
        }
    });
}

function create(req, res) {
    let tipoViaje = req.body;
    tipoViaje_db.create(tipoViaje, (err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(resultado);
        }
    });
}

function update(req, res) {
    let tipoViaje = req.body;
    let id_tipo = req.params.id_tipo;
    tipoViaje_db.update(tipoViaje, id_tipo, (err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(resultado);
        }
    });
}

function borrarTipoViaje(req, res) {
    let id_tipo = req.params.id_tipo;
    tipoViaje_db.borrarTipoViaje(id_tipo, (err, result_model) => {
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

function getTipoViajeById(req, res) {
    let id_tipo = req.params.id_tipo;
    tipoViaje_db.getTipoViajeById(id_tipo, (err, result_model) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(result_model);
        }
    });
}

// Exportar la aplicación Express
module.exports = app;
