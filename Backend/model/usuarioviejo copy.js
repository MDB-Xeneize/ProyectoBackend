require('rootpath')();
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

var usuario_db = {};

/*
usuario_db : es un objeto que sera invocado desde los endpoint del controlador. Aquí en el MODEL, dicho objeto posee las funcionalidades que permiten la interaccion con la base de datos como getAll, update, etc. Entonces desde usuarioController puedo invocar a usuario_db.update(); o usuario_db.borrar();

funCallback: en una funcion que la enviamos desde el endpoint del controlador, es mediante esta funcion que le damos una respuesta desde el MODEL hacia el CONTROLLER, aquí lo que enviamos como error o detalles con mensajes, es lo que recibira usuarioController para seguir su proceso de respuesta hacia el forontend
*/


// C = CREATE
// usuarioController --> app.post('/', createUser);
usuario_db.createUser = function (usuario, funCallback) {
    const consulta = "INSERT INTO usuario (rol, permisos, password, nickname, email) VALUES (?,?,?,?,?);";
    const params = [usuario.rol, parseInt(usuario.permisos), usuario.password, usuario.nickname, usuario.email];
    console.log(params);
    connection.query(consulta, params, (err, rows) => {
        if (err) {

            if (err.code == "ER_DUP_ENTRY") {
                funCallback({
                    mensajito: "el usuario ya fue registrado",
                    detalle: err
                });
            } else {
                funCallback({
                    mensajito: "error diferente",
                    detalle: err
                });
            }
        } else {

            funCallback(undefined, {
                mensajito: `Se creó el usuario ${usuario.nickname}`,
                detail: rows
            });
        }
    });
}

//R = READ
// usuarioController --> app.get('/', getAll);
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

//U = UPDATE
// usuarioController --> app.put('/:id_usuario', updateUser);
usuario_db.updateUser = function (datos_usuario, id_usaurio, funcallback) {
    params = [datos_usuario.email, datos_usuario.nickname, datos_usuario.password, datos_usuario.permisos, datos_usuario.rol, parseInt(id_usaurio)]
    consulta = "UPDATE usuario set email = ?, nickname = ?, password = ?, permisos= ?,rol =? WHERE id_usuario = ?;";
    console.log(params);
    connection.query(consulta, params, (err, result) => {
        if (err) {
            if (err.code = "ER_TRUNCATED_WRONG_VALUE") {
                funcallback({
                    message: `el id de usuario es incorrecto, se espera un numero entero`,
                    detail: err
                });
            } else {
                funcallback({
                    message: `error desconocido`,
                    detail: err
                });
            }
        } else {
            if (result.affectedRows == 0) {
                funcallback({
                    message: "No existe un usuario que coincida con el criterio de busqueda",
                    detail: result
                });
            } else {
                funcallback(undefined, {
                    message: `se actualizaron los datos del usuario ${id_usaurio}`,
                    detail: result
                });
            }

        }
    });



}

// D = DELETE
// usuarioController --> app.delete('/:id_usuario', deleteUser);
usuario_db.deleteUser = function (id_usuario, retorno) {
    consulta = "DELETE FROM usuario WHERE id_usuario = ?";
    connection.query(consulta, id_usuario, (err, result) => {
        if (err) {
            retorno({ menssage: err.code, detail: err }, undefined);

        } else {

            if (result.affectedRows === 0) {
                retorno(undefined, {
                    message: "no se encontro el usaurio, ingrese otro id",
                    detail: result
                });
            } else {
                retorno(undefined, {
                    message: `Se eliminó el usuario ${id_usuario}`,
                    detail: result
                });
            }
        }
    });
}

//securityController --> app.post('/login', login);
usuario_db.findByNickname = function (nickname, funCallback) {
    //var consulta = 'SELECT * FROM usuario WHERE nickname = ?';   
    var consulta = 'SELECT * FROM usuario where nickname = ?';
   connection.query(consulta, nickname, function (err, result) {
       if (err) {
           funCallback(err);
           return;
       } else {

           if (result.length > 0) {
               funCallback(undefined, {
                   message: `Usuario encontrado`,
                   detail: result[0]
               });
           } else {
               funCallback({
                   message: "No existe un usuario que coincida con el criterio de busqueda",
                   detail: result
               });
           }
       }
   });
}


module.exports = usuario_db;