require('rootpath')();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors'); // Importar cors
const configuracion = require("config/config.json");
const app = express();

app.use(cors()); // Habilitar CORS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));
morgan(':method :url :status :res[content-length] - :response-time ms');

//const configuracion = require("config.json");
//const controladorPersona = require("controller/personaController.js");
const controladorUsuario = require("controller/usuarioController.js");
const controladorChofer = require("controller/choferController.js");
const controladorVehiculo = require("controller/vehiculoController.js");
const controladorMantenimiento = require("controller/mantenimientoController.js");
const controladorTipo_Viaje = require("controller/tipo_ViajeController.js");
const controladorViaje = require("controller/inOutController.js");
const controladorGestiona = require("controller/gestionaController.js");
//const securityController = require("controller/securityController.js");
// Rutas de controladores
//app.use('/api/persona', controladorPersona);
const auth = require("config/auth.js");


app.use('/api/security', auth.app);
app.use('/api/usuario', controladorUsuario);
app.use('/api/chofer', controladorChofer);
app.use('/api/vehiculo', controladorVehiculo);
app.use('/api/mantenimiento', controladorMantenimiento);
app.use('/api/tipo_viaje', controladorTipo_Viaje);
app.use('/api/inOut', controladorViaje);
app.use('/api/gestiona', controladorGestiona);
//app.use('/security', securityController.app);

app.listen(configuracion.server.port, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Servidor escuchando en el puerto " + configuracion.server.port);
    }
});
