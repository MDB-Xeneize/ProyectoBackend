require('rootpath')();
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var usuarioDb = require("model/usuario.js");

// --rutas de escucha (endpoint) dispoibles para USUARIOS-- 

app.get('/', getAll);
app.post('/', createUser);
app.put('/:id_usuario', updateUser);
app.delete('/:id_usuario', deleteUser);


// ---------FUNCIONES UTILIZADAS EN ENDPOINTS ------------- 


function getAll(req, res) {
    usuarioDb.getAll((err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(resultado);
        }
    });
}

function createUser(req, res) {
    let usuario = req.body;
    console.log(usuario)
    usuarioDb.createUser(usuario, (err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(resultado);
        }
    });
}


function updateUser(req, res) {
    let datos_usuario = req.body; 
    let id_usaurio = req.params.id_usuario 
    console.log(datos_usuario,id_usaurio);
    usuarioDb.updateUser(datos_usuario, id_usaurio, (err,resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(resultado)
        }
    })
}


function deleteUser(req, res) {
    usuarioDb.deleteUser(req.params.id_usuario, (err, result_model) => {
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

module.exports = app;


