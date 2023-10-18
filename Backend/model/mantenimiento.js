// Código adaptado para la tabla "MANTENIMIENTO" con relación a "VEHICULO"

// Requerir configuraciones iniciales y módulo MySQL
require('rootpath')();
const mysql = require('mysql');
const configuracion = require("config.json");

// Inicializar la conexión con la base de datos
const connection = mysql.createConnection(configuracion.database);
connection.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Base de datos conectada");
    }
});

var mantenimiento_db = {};

// C = CREATE - Crear un mantenimiento
mantenimiento_db.crearMantenimiento = function (datos, funCallback) {
    consulta = "INSERT INTO mantenimiento (service_proximo, fecha, observaciones, id_vehiculo) VALUES (?, ?, ?, ?);";
    params = [datos.service_proximo, datos.fecha, datos.observaciones,parseInt(datos.id_vehiculo)];

    connection.query(consulta, params, (err, result) => {
        if (err) {
            if (err.code == "ER_DUP_ENTRY") {
                funCallback({
                    message: "El mantenimiento ya fue registrado anteriormente",
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
                message: `Se creó el mantenimiento con matrícula "${datos.matricula}"`,
                detail: result
            });
        }
    });
}

// R = READ - Obtener todos los mantenimientos
mantenimiento_db.getAll = function (funCallback) {
    var consulta = 'SELECT * from mantenimiento INNER JOIN vehiculo ON mantenimiento.id_vehiculo = vehiculo.id_vehiculo';
    connection.query(consulta, function (err, rows) {
        if (err) {
            funCallback({
                message: "Ha ocurrido un error inesperado al buscar los mantenimientos",
                detail: err
            });
        } else {
            funCallback(undefined, rows);
        }
    });
}

// U = UPDATE - Actualizar un mantenimiento por ID
mantenimiento_db.actualizarMantenimiento = function (datos, id_mantenimiento, funCallback) {
    const consulta = "UPDATE mantenimiento SET service_proximo = ?, fecha = ?, observaciones = ?, id_vehiculo = ? WHERE id_mantenimiento = ?";
    const params = [datos.service_proximo, datos.fecha, datos.observaciones,parseInt(datos.id_vehiculo),parseInt(id_mantenimiento)];
    console.log(params,consulta);

    connection.query(consulta, params, (err, result) => {
        if (err) {
            if (err.code == "ER_DUP_ENTRY") { 
                funCallback({
                    message: "Los datos a insertar generan un mantenimiento duplicado",
                    detail: err
                });
            } else {
                funCallback({
                    message: "Error diferente, analizar código de error",
                    detail: err
                });
            }
        } else if (result.affectedRows == 0) { 
            funCallback({
                message: "No existe un mantenimiento que coincida con el criterio de búsqueda",
                detail: result
            });
        } else {
            funCallback(undefined, {
                message: `Se modificó el mantenimiento con ID ${id_mantenimiento}`,
                detail: result
            });
        }
    });
}

// D = DELETE - Eliminar un mantenimiento por ID
mantenimiento_db.borrarMantenimiento = function (id_mantenimiento, funCallback) {
    consulta = "DELETE FROM mantenimiento WHERE id_mantenimiento = ?";
    id_mantenimiento=parseInt(id_mantenimiento);
    console.log(id_mantenimiento);
    connection.query(consulta, id_mantenimiento, (err, result) => {
        if (err) {
            funCallback({ message: err.code, detail: err });
        } else {
            if (result.affectedRows == 0) {
                funCallback(undefined,
                    {
                        message: "No se encontró un mantenimiento con el ID ingresado",
                        detail: result
                    });
            } else {
                funCallback(undefined, { message: `Eliminado Registro de mantenimiento ${id_mantenimiento} `, detail: result });
            }
        }
    });
}

// Obtener un mantenimiento por ID
mantenimiento_db.getById = function (id, funCallback) {
    var consulta = 'SELECT mantenimiento.*, vehiculo.marca AS vehiculo_marca FROM mantenimiento ' +
                   'INNER JOIN vehiculo ON mantenimiento.matricula = vehiculo.matricula ' +
                   'WHERE mantenimiento.id_mantenimiento = ?';
    connection.query(consulta, id, (err, result) => {
        if (err) {
            funCallback({
                message: "Ha ocurrido un error inesperado al buscar el mantenimiento",
                detail: err
            });
        } else if (result.length == 0) {
            funCallback(undefined, {
                message: `No se encontró un mantenimiento con el ID: ${id}`,
                detail: result
            });
        } else {
            funCallback(undefined, {
                message: `Los datos del mantenimiento con ID ${id} son:`,
                detail: result
            });
        }
    });
}

// Exportar el objeto mantenimiento_db para que Node.js lo haga público y pueda utilizarse desde otros módulos
module.exports = mantenimiento_db;
