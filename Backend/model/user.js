require('rootpath')();

var usuario_db = {};

const { query } = require('express');
const mysql = require('mysql');
const configuracion = require("config.json");


var connection = mysql.createConnection(configuracion.database);
connection.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("base de datos conectada");
    }
});


//Las consultas estan adaptadas para trabajar con la 
//BD usuario modificada por el punto 7


usuario_db.getAll = function (funCallback) {
    var consulta = 'SELECT * FROM usuario';
    connection.query(consulta, function (err, rows) {
        if (err) {
            funCallback(err);
            return;
        } else {
            funCallback(undefined, rows);
        }
    });
}

//-------------------------------pagina loggeo-----------------------------------

usuario_db.postBylog = function (usuario,funCallback) {
    consulta = 'SELECT * FROM usuario WHERE nickname = ? and password = ?';
    params = [usuario.nickname, usuario.password];
    connection.query(consulta,params,function (err, rows) {
        if (err) {
            funCallback(err,undefined);
            return;
        } 
            else {
            funCallback(undefined, rows);
        }
    });
}


//-------------------------------------pagina loggeo-------------------------------------------

// usuario_db.getBypassword = function (password_busca,funCallback) {
//     consulta = 'SELECT * FROM usuario WHERE password = ?';
//     params = password_busca;
//     connection.query(consulta,params, function (err, rows) {
//         if (err) {
//             funCallback(err,undefined);
//             return;
//         } 
//             else {
//             funCallback(undefined, rows);
//         }
//     });
// }

usuario_db.create = function (usuario, funcallback) {
    consulta = "INSERT INTO usuario (nickname,password,email,rol,permisos) VALUES (?,?,?,?,?);";
    params = [usuario.nickname, usuario.password, usuario.email, usuario.rol,usuario.permisos];

    connection.query(consulta, params, (err, detail_bd) => {
        if (err) {

            if (err.code == "ER_DUP_ENTRY") {
                funcallback({
                    mensaje: "el usuario ya existe",
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
                mensaje: "se creo el usaurio " + usuario.nickname,
                detalle: detail_bd
            });
        }
    });
}


usuario_db.borrar = function (mail_borrar , funcallback) {
    consulta = "DELETE FROM usuario WHERE mail = ?";
    params = mail_borrar;

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

usuario_db.modificar = function (usuario_put,idUsuario_put, funcallback) {
    consulta = "UPDATE usuario SET nickname= ?,password= ?,email= ?,rol= ?,permisos= ?   WHERE id_usuario = ?;";
    params = [usuario_put.nickname,usuario_put.password,usuario_put.email,usuario_put.rol,usuario_put.permisos,idUsuario_put];

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

module.exports = usuario_db;