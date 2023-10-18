// Rutas de escucha (endpoint) disponibles para CHOFERES
require('rootpath')();
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const chofer_db = require("model/chofer.js");

const auth = require("config/auth.js");
// Rutas
app.get('/', auth.verificarToken, getAll);
app.post('/', auth.verificarToken, create);
app.put('/:id_chofer', auth.verificarToken, update);
app.delete('/:id_chofer', auth.verificarToken, deleteChofer);
app.get('/:dni', getByDNI);
app.get('/usuario/:dni', getUserByChofer);

// Funciones utilizadas en endpoints

function getAll(req, res) {
    chofer_db.getAll((err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(resultado);
        }
    });
}

function create(req, res) {
    let chofer = req.body;
    chofer_db.create(chofer, (err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(resultado);
        }
    });
}

function update(req, res) {
    let chofer = req.body;
    let id_chofer = parseInt(req.params.id_chofer);
 
    chofer_db.update(chofer, id_chofer, (err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(resultado);
        }
    });
}

function deleteChofer(req, res) {
    let id_chofer = parseInt(req.params.id_chofer);
    console.log(id_chofer);
    chofer_db.deleteChofer(id_chofer, (err, resultModel) => {
        if (err) {
            res.status(500).send(err);
        } else {
            if (resultModel.detail.affectedRows == 0) {
                res.status(404).send(resultModel.message);
            } else {
                res.send(resultModel);
            }
        }
    });
}

function getUserByChofer(req, res) {
    chofer_db.getUserByChofer(req.params.dni, (err, resultModel) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(resultModel);
        }
    });
}

function getByDNI(req, res) {
    let dni = req.params.dni;
    chofer_db.getByDNI(dni, (err, resultModel) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(resultModel);
        }
    });
}

module.exports = app;
