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

const chofer_db = {};

// C = CREATE
chofer_db.create = function (datos, funCallback) {
    const consulta = "INSERT INTO chofer (apellido, nombre, dni, fecha_nacimiento) VALUES (?,?,?,?);";
    const params = [datos.apellido, datos.nombre, datos.dni, datos.fecha_nacimiento];

    connection.query(consulta, params, (err, rows) => {
        if (err) {
            if (err.code === "ER_DUP_ENTRY") {
                funCallback({
                    message: "El chofer ya fue registrado anteriormente",
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
                message: `Se creó el chofer ${datos.nombre} ${datos.apellido}`,

            });
        }
    });
}

// R = READ
chofer_db.getAll = function (funCallback) {
    const consulta = 'SELECT * FROM chofer';
    connection.query(consulta, (err, rows) => {
        if (err) {
            funCallback({
                message: "Ha ocurrido un error inesperado al buscar el chofer",
                detail: err
            });
        } else {
            funCallback(undefined, rows);
        }
    });
}

// U = UPDATE
chofer_db.update = function (datos, id_chofer, funCallback) {
    const consulta = "UPDATE chofer SET apellido = ?, nombre = ?, fecha_nacimiento = ?, dni=? WHERE id_chofer = ?";
    const params = [datos.apellido, datos.nombre, datos.fecha_nacimiento, datos.dni, id_chofer];

    connection.query(consulta, params, (err, result) => {
        if (err) {
            if (err.code === "ER_DUP_ENTRY") {
                funCallback({
                    message: `Se modificó el chofer ${datos.nombre} ${datos.apellido}`,
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
                message: "No existe chofer que coincida con el criterio de búsqueda",
                detail: result
            });
        } else {
            funCallback(undefined, {
                message: `Se modificó el chofer ${datos.nombre} ${datos.apellido}`,
                detail: result
            });
        }
    });
}

// D = DELETE
chofer_db.deleteChofer = function (id_chofer, funCallback) {
    // Aplicamos trim() para eliminar espacios en blanco alrededor del valor del DNI
    //const dni_choferLimpio = dni_chofer.trim();
    const id_choferLimpio = id_chofer;
    const consulta = "DELETE FROM chofer WHERE id_chofer = ?";
    connection.query(consulta, [id_choferLimpio], (err, result) => {
        if (err) {
            funCallback({ message: err.code, detail: err });
        } else {
            if (result.affectedRows === 0) {
                funCallback(undefined, {
                    message: "No se encontró un chofer con el DNI ingresado",
                    detail: result
                });
            } else {
                funCallback(undefined, {
                    message: "Chofer eliminado",
                    detail: result
                });
            }
        }
    });
}


// Obtener chofer por DNI
chofer_db.getByDNI = function (dni, funCallback) {
    const consulta = 'SELECT * FROM chofer WHERE dni = ?';
    connection.query(consulta, dni, (err, result) => {
        if (err) {
            funCallback({
                message: "Ha ocurrido algún error inesperado al buscar el chofer",
                detail: err
            });
        } else if (result.length === 0) {
            funCallback(undefined, {
                message: `No se encontró un chofer con el DNI: ${dni}`,
                detail: result
            });
        } else {
            funCallback(undefined, {
                message: `Los datos del chofer con el DNI ${dni} son:`,
                detail: result
            });
        }
    });
}

// Obtener usuario por chofer
chofer_db.getUserByChofer = function (chofer, funCallback) {
    const consulta = "SELECT nickname FROM usuario INNER JOIN chofer ON usuario.chofer = chofer.dni AND usuario.chofer = ?";

    connection.query(consulta, chofer, (err, result) => {
        if (err) {
            funCallback({
                message: "Ha ocurrido algún error, posiblemente de sintaxis, al buscar el chofer",
                detail: err
            });
        } else if (result.length === 0) {
            funCallback(undefined, {
                message: "El chofer seleccionado no posee usuario registrado en la base de datos",
                detail: result
            });
        } else {
            funCallback(undefined, {
                message: `El nickname del chofer seleccionado es ${result[0]['nickname']}`,
                detail: result
            });
        }
    });
}

// Exportamos el objeto chofer_db para que Node.js lo haga público y pueda utilizarse desde otros módulos
module.exports = chofer_db;
