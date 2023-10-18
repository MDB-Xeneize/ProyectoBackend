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

var tipoViaje_db = {};

// C = CREATE - Crear un tipo de viaje
tipoViaje_db.create = function (datos, funCallback) {
    consulta = "INSERT INTO tipo_viaje (carga, nombre) VALUES (?, ?);";
    params = [datos.carga, datos.nombre];

    connection.query(consulta, params, (err, result) => {
        if (err) {
            if (err.code == "ER_DUP_ENTRY") {
                funCallback({
                    message: "El tipo de viaje ya fue registrado anteriormente",
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
                message: `Se creó el tipo de viaje "${datos.nombre}" con carga "${datos.carga}"`,
                detail: result
            });
        }
    });
}

// R = READ - Obtener todos los tipos de viaje
tipoViaje_db.getAll = function (funCallback) {
    var consulta = 'SELECT * FROM tipo_viaje';
    connection.query(consulta, function (err, rows) {
        if (err) {
            funCallback({
                message: "Ha ocurrido un error inesperado al buscar los tipos de viaje",
                detail: err
            });
        } else {
            funCallback(undefined, rows);
        }
    });
}

// U = UPDATE - Actualizar un tipo de viaje por ID
tipoViaje_db.update = function (datos, id_tipo, funCallback) {
    consulta = "UPDATE tipo_viaje SET carga = ?, nombre = ? WHERE id_tipo = ?";
    params = [datos.carga, datos.nombre, id_tipo];

    connection.query(consulta, params, (err, result) => {
        if (err) {
            if (err.code == "ER_DUP_ENTRY") { // Carga o nombre duplicado
                funCallback({
                    message: "Los datos a insertar generan un tipo de viaje duplicado",
                    detail: err
                });
            } else { // Otro código de error
                funCallback({
                    message: "Error diferente, analizar código de error",
                    detail: err
                });
            }
        } else if (result.affectedRows == 0) { // Tipo de viaje a actualizar no encontrado
            funCallback({
                message: "No existe un tipo de viaje que coincida con el criterio de búsqueda",
                detail: result
            });
        } else {
            funcallback(undefined, {
                message: `Se modificó el tipo de viaje con ID ${id_tipo}`,
                detail: result
            });
        }
    });
}

// D = DELETE - Eliminar un tipo de viaje por ID
tipoViaje_db.borrarTipoViaje = function (id, funCallback) {
    consulta = "DELETE FROM tipo_viaje WHERE id_tipo = ?";
    connection.query(consulta, id, (err, result) => {
        if (err) {
            funCallback({ message: err.code, detail: err });
        } else {
            if (result.affectedRows == 0) {
                funCallback(undefined,
                    {
                        message: "No se encontró un tipo de viaje con el ID ingresado",
                        detail: result
                    });
            } else {
                funCallback(undefined, { message: "Tipo de viaje eliminado", detail: result });
            }
        }
    });
}

// Exportamos el objeto tipoViaje_db para que Node.js lo haga público y pueda utilizarse desde otros módulos
module.exports = tipoViaje_db;
