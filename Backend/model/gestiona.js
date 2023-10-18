// Código adaptado para la tabla "GESTIONA" con relaciones

// Configuraciones iniciales
require('rootpath')();
const mysql = require('mysql');
const configuracion = require("config.json");

// Inicializa la conexión entre el servidor y la base de datos
const connection = mysql.createConnection(configuracion.database);

connection.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Base de datos conectada");
    }
});

const gestiona_db = {};

// C = CREATE
gestiona_db.createGestiona = function (datos, funCallback) {
    const consulta = "INSERT INTO gestiona (id_viaje, id_usuario) VALUES (?, ?);";
    const params = [datos.id_viaje, datos.id_usuario];

    connection.query(consulta, params, (err, rows) => {
        if (err) {
            if (err.code === "ER_DUP_ENTRY") {
                funCallback({
                    message: "La gestión ya fue registrada anteriormente",
                    detail: err
                });
            } else {
                funCallback({
                    message: "Error diferente",
                    detail: err
                });
            }
        } else {
            funCallback(undefined, {
                message: `Se creó la gestión con ID de viaje "${datos.id_viaje}" y ID de usuario "${datos.id_usuario}"`,
            });
        }
    });
}

// R = READ
gestiona_db.getAllGestiona = function (funCallback) {
    const consulta = 'SELECT gestiona.*, usuario.nickname AS usuario_nickname, viaje.destino AS viaje_destino, viaje.carga AS viaje_carga FROM gestiona ' +
                     'INNER JOIN usuario ON gestiona.id_usuario = usuario.id_usuario ' +
                     'INNER JOIN viaje ON gestiona.id_viaje = viaje.id_viaje';
    connection.query(consulta, (err, rows) => {
        if (err) {
            funCallback({
                message: "Ha ocurrido un error inesperado al buscar las gestiones",
                detail: err
            });
        } else {
            funCallback(undefined, rows);
        }
    });
}

// U = UPDATE
gestiona_db.updateGestiona = function (datos, id_viaje, id_usuario, funCallback) {
    const consulta = "UPDATE gestiona SET id_viaje = ?, id_usuario = ? WHERE id_viaje = ? AND id_usuario = ?";
    const params = [datos.id_viaje, datos.id_usuario, id_viaje, id_usuario];

    connection.query(consulta, params, (err, result) => {
        if (err) {
            if (err.code === "ER_DUP_ENTRY") {
                funCallback({
                    message: `Se modificó la gestión con ID de viaje "${datos.id_viaje}" y ID de usuario "${datos.id_usuario}"`,
                    detail: err
                });
            } else {
                funCallback({
                    message: "Error diferente, analizar código de error",
                    detail: err
                });
            }
        } else if (result.affectedRows === 0) {
            funCallback({
                message: "No existe gestión que coincida con el criterio de búsqueda",
                detail: result
            });
        } else {
            funCallback(undefined, {
                message: `Se modificó la gestión con ID de viaje "${id_viaje}" y ID de usuario "${id_usuario}"`,
                detail: result
            });
        }
    });
}

// D = DELETE
gestiona_db.deleteGestiona = function (id_viaje, id_usuario, funCallback) {
    const consulta = "DELETE FROM gestiona WHERE id_viaje = ? AND id_usuario = ?";
    const params = [id_viaje, id_usuario];

    connection.query(consulta, params, (err, result) => {
        if (err) {
            funCallback({ message: err.code, detail: err });
        } else {
            if (result.affectedRows === 0) {
                funCallback(undefined,
                    {
                        message: "No se encontró una gestión con los IDs ingresados",
                        detail: result
                    });
            } else {
                funCallback(undefined, { message: "Gestión eliminada", detail: result });
            }
        }
    });
}

// Obtener gestión por ID de viaje e ID de usuario
gestiona_db.getGestiona = function (id_viaje, id_usuario, funCallback) {
    const consulta = 'SELECT gestiona.*, usuario.nickname AS usuario_nickname, viaje.destino AS viaje_destino, viaje.carga AS viaje_carga FROM gestiona ' +
                     'INNER JOIN usuario ON gestiona.id_usuario = usuario.id_usuario ' +
                     'INNER JOIN viaje ON gestiona.id_viaje = viaje.id_viaje ' +
                     'WHERE gestiona.id_viaje = ? AND gestiona.id_usuario = ?';
    const params = [id_viaje, id_usuario];

    connection.query(consulta, params, (err, result) => {
        if (err) {
            funCallback({
                message: "Ha ocurrido algún error inesperado al buscar la gestión",
                detail: err
            });
        } else if (result.length === 0) {
            funCallback(undefined, {
                message: `No se encontró una gestión con el ID de viaje "${id_viaje}" y el ID de usuario "${id_usuario}"`,
                detail: result
            });
        } else {
            funCallback(undefined, {
                message: `Los datos de la gestión con ID de viaje "${id_viaje}" y ID de usuario "${id_usuario}" son:`,
                detail: result
            });
        }
    });
}

// Exportar el objeto gestiona_db para que Node.js lo haga público y pueda utilizarse desde otros módulos
module.exports = gestiona_db;