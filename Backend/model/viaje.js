// Código adaptado para la tabla "VIAJE" con relaciones

// Requerir configuraciones iniciales y módulo MySQL
require('rootpath')();
const mysql = require('mysql');
const configuracion = require("config.json");

// Inicializar la conexión con la base de datos
var connection = mysql.createConnection(configuracion.database);
connection.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Base de datos conectada");
    }
});

var viaje_db = {};

// C = CREATE - Crear un viaje
viaje_db.crearViaje = function (datos, funCallback) {
    consulta = "INSERT INTO viaje (carga, destino, fecha, peso_total, origen, hora, id_chofer, matricula, id_tipo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);";
    params = [datos.carga, datos.destino, datos.fecha, datos.peso_total, datos.origen, datos.hora, datos.id_chofer, datos.matricula, datos.id_tipo];

    connection.query(consulta, params, (err, result) => {
        if (err) {
            if (err.code == "ER_DUP_ENTRY") {
                funCallback({
                    message: "El viaje ya fue registrado anteriormente",
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
                message: `Se creó el viaje con destino "${datos.destino}" y carga "${datos.carga}"`,
                detail: result
            });
        }
    });
}

// R = READ - Obtener todos los viajes
viaje_db.getAllViajes = function (funCallback) {
    var consulta = 'SELECT viaje.*, chofer.nombre AS chofer_nombre, vehiculo.marca AS vehiculo_marca, tipo_viaje.nombre AS tipo_viaje_nombre FROM viaje ' +
                   'INNER JOIN chofer ON viaje.id_chofer = chofer.id_chofer ' +
                   'INNER JOIN vehiculo ON viaje.matricula = vehiculo.matricula ' +
                   'INNER JOIN tipo_viaje ON viaje.id_tipo = tipo_viaje.id_tipo';
    connection.query(consulta, function (err, rows) {
        if (err) {
            funCallback({
                message: "Ha ocurrido un error inesperado al buscar los viajes",
                detail: err
            });
        } else {
            funCallback(undefined, rows);
        }
    });
}

// U = UPDATE - Actualizar un viaje por ID
viaje_db.actualizarViaje = function (datos, id, funCallback) {
    consulta = "UPDATE viaje SET carga = ?, destino = ?, fecha = ?, peso_total = ?, origen = ?, hora = ?, id_chofer = ?, matricula = ?, id_tipo = ? WHERE id_viaje = ?";
    params = [datos.carga, datos.destino, datos.fecha, datos.peso_total, datos.origen, datos.hora, datos.id_chofer, datos.matricula, datos.id_tipo, id];

    connection.query(consulta, params, (err, result) => {
        if (err) {
            if (err.code == "ER_DUP_ENTRY") { // Viaje duplicado
                funCallback({
                    message: "Los datos a insertar generan un viaje duplicado",
                    detail: err
                });
            } else { // Otro código de error
                funCallback({
                    message: "Error diferente, analizar código de error",
                    detail: err
                });
            }
        } else if (result.affectedRows == 0) { // Viaje a actualizar no encontrado
            funCallback({
                message: "No existe un viaje que coincida con el criterio de búsqueda",
                detail: result
            });
        } else {
            funcallback(undefined, {
                message: `Se modificó el viaje con ID ${id}`,
                detail: result
            });
        }
    });
}

// D = DELETE - Eliminar un viaje por ID
viaje_db.borrarViaje = function (id, funCallback) {
    consulta = "DELETE FROM viaje WHERE id_viaje = ?";
    connection.query(consulta, id, (err, result) => {
        if (err) {
            funCallback({ message: err.code, detail: err });
        } else {
            if (result.affectedRows == 0) {
                funCallback(undefined,
                    {
                        message: "No se encontró un viaje con el ID ingresado",
                        detail: result
                    });
            } else {
                funCallback(undefined, { message: "Viaje eliminado", detail: result });
            }
        }
    });
}

// Obtener un viaje por ID
viaje_db.getViajeById = function (id, funCallback) {
    var consulta = 'SELECT viaje.*, chofer.nombre AS chofer_nombre, vehiculo.marca AS vehiculo_marca, tipo_viaje.nombre AS tipo_viaje_nombre FROM viaje ' +
                   'INNER JOIN chofer ON viaje.id_chofer = chofer.id_chofer ' +
                   'INNER JOIN vehiculo ON viaje.matricula = vehiculo.matricula ' +
                   'INNER JOIN tipo_viaje ON viaje.id_tipo = tipo_viaje.id_tipo ' +
                   'WHERE viaje.id_viaje = ?';
    connection.query(consulta, id, (err, result) => {
        if (err) {
            funCallback({
                message: "Ha ocurrido un error inesperado al buscar el viaje",
                detail: err
            });
        } else if (result.length == 0) {
            funCallback(undefined, {
                message: `No se encontró un viaje con el ID: ${id}`,
                detail: result
            });
        } else {
            funCallback(undefined, {
                message: `Los datos del viaje con ID ${id} son:`,
                detail: result
            });
        }
    });
}

// Exportar el objeto viaje_db para que Node.js lo haga público y pueda utilizarse desde otros módulos
module.exports = viaje_db;
