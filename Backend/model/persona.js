require('rootpath')();

var persona_db = {};

const { query } = require('express');
const mysql = require('mysql');
const configuracion = require("config.json");
const { param } = require('../controller/personaController');


var connection = mysql.createConnection(configuracion.database);
connection.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("base de datos conectada");
    }
});




persona_db.getAll = function (funCallback) {
    var consulta = 'SELECT * FROM persona;';
    connection.query(consulta, function (err, rows) {
        if (err) {
            funCallback(err);
            return;
        } else {
            funCallback(undefined, rows);
        }
    });
}


persona_db.getByUser = function (dni_persona, funcallback) {
    consulta =' SELECT * FROM persona WHERE dni = ? ;';
    params = dni_persona;
   
    connection.query(consulta, params, (err, respuesta) => {
        if (err) {
            funcallback({
                mensaje: "a ocurrido algun error 1",
                detail: err
            });
        } else if (respuesta.length == 0) { //consulta no impacta en nada dentro de la BD
            funcallback(undefined, {
                mensaje: "no se encontro la persona",
                detail: respuesta
            });
        } else {
            consulta = "SELECT nickname FROM usuario INNER JOIN persona ON usuario.dni_persona = persona.dni WHERE usuario.dni_persona = ?";
            connection.query(consulta, params, (err, resultado) => {
                if (err) {
                    funcallback({
                        mensaje: "a ocurrido algun error",
                        detail: err
                    });
                } else if (resultado.length == 0) { //array vacio
                    funcallback(undefined, {
                        mensaje: "la persona seleccionada no posee usuario",
                        detail: resultado
                    });
                } else {
                    funcallback(undefined, { // consulta impacta bien, y el array no esta vacio 
                        mensaje: `El nikname es ${resultado[0]['nickname']}`,
                        detail: resultado
                    });
                }
            });


        }
    });
}




persona_db.getByApellido = function (ape_busca,funCallback) {
    consulta = "SELECT * FROM persona WHERE apellido = ?;";
    params = ape_busca;
    connection.query(consulta,params, function (err, rows) {
        if (err) {
            funCallback(err,undefined);
            return;
        } 
            else {
            funCallback(undefined, rows);
        }
    });
}

persona_db.getdni = function (dni_busca,funCallback) {
    consulta = "SELECT * FROM persona WHERE dni = ?";
    params = dni_busca;
    connection.query(consulta,params, function (err, rows) {
        if (err) {
            funCallback(err,undefined);
            return;
        } 
            else {
            funCallback(undefined, rows);
        }
    });
}

persona_db.create = function (persona, funcallback) {
    consulta = "INSERT INTO persona (dni, nombre, apellido) VALUES (?,?,?);";
    params = [persona.dni,persona.nombre,persona.apellido ];

    connection.query(consulta, params, (err, detail_bd) => {
        if (err) {

            if (err.code == "ER_DUP_ENTRY") {
                funcallback({
                    mensaje: "La persona ya fue registrada",
                    detalle: err
                });
            } else {
                funcallback({
                    mensaje: "error",
                    detalle: err
                });
            }
        } else {

            funcallback(undefined, {
                mensaje: "se creo la persona " + persona.nombre+" "+ persona.apellido,
                detalle: detail_bd
            });
        }
    });
}

persona_db.borrar = function (dni_borrar , funcallback) {
    consulta = "DELETE FROM persona WHERE dni = ?;";
    params = dni_borrar;

    connection.query(consulta, params, (err,resultado) => {
        if (err) {
            funcallback({
                menssage: err.code,
                detail: err},
                undefined
                );
            
        } else {
            funcallback(undefined,{
                menssage:"registro eliminado",
                detail: resultado 
            });   
        }
    });
}

persona_db.modificar = function (persona_putear,dni_putear, funcallback) {
    consulta = "UPDATE persona SET dni= ?,nombre= ?,apellido= ?   WHERE dni = ?;";
    params = [persona_putear.dni,persona_putear.nombre,persona_putear.apellido,dni_putear];

    connection.query(consulta, params , (err,resultado) => {
        if (err) {
            funcallback({
                mensaje: err.code,
                detail: err},
                undefined
                );
            
        }  
        else {
            funcallback(undefined,{
                mensaje:"registro cambiado",
                detail: resultado 
            });   
        }
    });
}

module.exports = persona_db;