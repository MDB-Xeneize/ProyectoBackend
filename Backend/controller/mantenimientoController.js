// Importar las dependencias necesarias
require('rootpath')();
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Reemplaza "model/mantenimiento.js" con la ubicación correcta de tu módulo de base de datos para la tabla MANTENIMIENTO
var mantenimiento_db = require("model/mantenimiento.js");

const auth = require("config/auth.js");
// Rutas de escucha (endpoints) disponibles para MANTENIMIENTO
app.get('/', auth.verificarToken, getAllMantenimientos);
app.post('/', auth.verificarToken, crearMantenimiento);
app.put('/:id_mantenimiento', auth.verificarToken, actualizarMantenimiento);
app.delete('/:id_mantenimiento', auth.verificarToken, borrarMantenimiento);
app.get('/:id_mantenimiento', auth.verificarToken, getMantenimientoById);

// Funciones utilizadas en los endpoints

function getAllMantenimientos(req, res) {
    mantenimiento_db.getAll(function (err, resultado) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(resultado);
        }
    });
}

function crearMantenimiento(req, res) {
    let mantenimiento = req.body;
    mantenimiento_db.crearMantenimiento(mantenimiento, (err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(resultado);
        }
    });
}

function actualizarMantenimiento(req, res) {
    let mantenimiento = req.body;
    let id_mantenimiento = req.params.id_mantenimiento;
    mantenimiento_db.actualizarMantenimiento(mantenimiento, id_mantenimiento, (err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(resultado);
        }
    });
}

function borrarMantenimiento(req, res) {
    let id_mantenimiento = req.params.id_mantenimiento;
    mantenimiento_db.borrarMantenimiento(id_mantenimiento, (err, result_model) => {
        if (err) {
            res.status(500).send(err);
        } else {
            if (result_model.detail.affectedRows == 0) {
                res.status(404).send(result_model);
            } else {
                res.send(result_model);
            }
        }
    });
}

function getMantenimientoById(req, res) {
    let id_mantenimiento = req.params.id_mantenimiento;
    mantenimiento_db.getMantenimientoById(id_mantenimiento, (err, result_model) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(result_model);
        }
    });
}


module.exports = app;
