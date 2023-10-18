require('rootpath')();
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//const router = express.Router();



var inOutDb = require("model/InOut.js");

app.get('/', (req, res) => {
    
    inOutDb.getAll((err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(resultado);
        }
    });

});

app.get('/:id_viaje', (req, res) => {
    params = req.params.id_viaje;
    inOutDb.getByIdViaje(params,(err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else{
            res.json(resultado);
        }
    });
});

app.get('/agregar/chofer', (req, res) => {

    inOutDb.getAllChofer((err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else{
            res.json(resultado);
        }
    });
});

app.get('/agregar/vehiculo', (req, res) => {

    inOutDb.getAllVehiculo((err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else{
            res.json(resultado);
        }
    });
});

app.post('/', (req, res) => {

    let registro = req.body;
    inOutDb.create(registro, (err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {
            //res.send(rows);
            res.send(resultado);
        }
    });

});

app.put('/:id_viaje' , (req, res) => {
    let registro_put = req.body;
    let id_viaje_put = req.params.id_viaje;
    inOutDb.modificar(registro_put,id_viaje_put, (err ,resultado) => {
        if (err){
            res.status(500).send(err);
        }
        else{
            res.send(resultado);
        }
    });
});
///

app.delete('/:id_viaje/:id_tipo/:seleccion' , (req, res) => {
    const id_viaje_borrar = req.params.id_viaje;
    const id_tipo_borrar = req.params.id_tipo;
    const seleccion = req.params.seleccion;
    const seleccionDecodificada = decodeURIComponent(seleccion);
    const seleccionJSON = JSON.parse(seleccionDecodificada);
    console.log(req.params.id_viaje,req.params.id_tipo,seleccionJSON);
    inOutDb.borrar(id_viaje_borrar,id_tipo_borrar,seleccionJSON, (err ,resultado) => {
        if (err){
            res.status(500).send(err);
        }
        else{
            res.send(resultado);
        }
    });
});


module.exports = app;