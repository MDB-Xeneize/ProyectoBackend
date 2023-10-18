//DECLARACIONES Y CONFIGURACIONES INICIALES
const express = require('express');
const mysql = require('mysql');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(express.static("public"));

// FIN DECLARACIONES

/// AVISODE QUE EL PUERTO 8080 ESTA LEVANTADO
app.listen(8080,(err)=>{
  if (err){
      console.log(err);
  }else{
      console.log("hola")
  }
});
///FIN

///CONEXION BASE DE DATOS

var connection = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : 'mariconmariadb',
  database : 'bancked'
});

// conectarse a mysql
connection.connect(function(err) {
  // en caso de error
  if(err){
  console.log(err);
  }else{
      console.log("Bd conectada")
  }
});

// Se carga la tabla chofer
app.post('/api/chofer', (req, res) => {
  const parametros = [req.body.apellido, req.body.nombre, req.body.dni, req.body.fecha_nacimiento];
  const query = 'INSERT INTO chofer (apellido, nombre, dni, fecha_nacimiento) VALUES (?, ?, ?, ?)';
  
  connection.query(query, parametros, (err, result) => {
      if (err) {
          res.status(500).send(err);
      } else {
          res.send("Se creó el chofer " + req.body.nombre + " " + req.body.apellido);
      }
  });
});


app.post('/api/login', (req, res) => {
  params = req.body
//  usuario_db.postBylog = function (usuario,funCallback) {
      consulta = 'SELECT nickname,permisos FROM usuario WHERE nickname = ? and password = ?;';
      params = [params.nickname, params.password];
      connection.query(consulta,params,function (err, rows) {
          if (err) {
            res.status(500).send(err);
              return;
          } 
              else {
                //res.json(rows);
                console.log(rows);
                const resultado=rows;
                
                if (resultado.length!=0) {
                  // Si las credenciales son válidas, redirige al usuario a una página HTML en la carpeta "public"
                  res.redirect('/menu/menu.html');
                } else {
                  // Si las credenciales no son válidas, redirige al usuario a una página HTML de error en la carpeta "public"
                  res.redirect('/logeo/log.html');
                }
          }
      });
  //}
  
  // usuarioDb.postBylog(params,(err, resultado) => {
  //     if (err) {
  //         res.status(500).send(err);
  //     } else{
  //         res.json(resultado);
  //     }
  // });

});

// Se carga la tabla vehiculo
app.post('/api/vehiculo', (req, res) => {
  const parametros = [req.body.carga_maxima, req.body.marca, req.body.matricula, req.body.tara, req.body.año, req.body.modelo]; 
  const query = 'INSERT INTO vehiculo (carga_maxima, marca, matricula, tara, año, modelo) VALUES (?, ?, ?, ?, ?, ?)'; 
  
  connection.query(query, parametros, (err, result) => {
      if (err) {
          res.status(500).send(err);
      } else {
          res.send("Se creó el vehiculo " + req.body.marca + " " + req.body.modelo + " " + req.body.matricula);
      }
  });
});

// Se carga la tabla tipo_viaje
app.post('/api/tipo_viaje', (req, res) => {
    const parametros = [req.body.carga, req.body.nombre]; 
    const query = 'INSERT INTO tipo_viaje (carga, nombre) VALUES (?, ?)'; 
    
    connection.query(query, parametros, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send("Se creó el tipo_viaje " + req.body.nombre);
        }
    });
  });
  



// Se carga la tabla viaje
app.post('/api/viaje', (req, res) => {
    const parametros = [
      req.body.destino,
      req.body.fecha,
      req.body.peso_carga,
      req.body.peso_total,
      req.body.origen,
      req.body.hora,
      req.body.id_chofer,
      req.body.id_vehiculo, 
      req.body.id_tipo
    ];
  
    const queryTipoViaje = 'SELECT carga FROM tipo_viaje WHERE id_tipo = ?'; // Consulta para obtener carga basada en id_tipo
    const queryViaje = 'INSERT INTO viaje (carga, destino, fecha, peso_carga, peso_total, origen, hora, id_chofer, id_vehiculo, id_tipo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  
    connection.query(queryTipoViaje, [req.body.id_tipo], (err, resultTipoViaje) => {
      if (err) {
        res.status(500).send(err);
      } else {
        if (resultTipoViaje.length > 0) {
          parametros.unshift(resultTipoViaje[0].carga); // Agrega la carga en la posición 0 del arreglo de parámetros
          connection.query(queryViaje, parametros, (err, result) => {
            if (err) {
              res.status(500).send(err);
            } else {
              res.send("Se creó el viaje a " + req.body.destino);
            }
          });
        } else {
          res.status(400).send("No se encontró el tipo de viaje correspondiente.");
        }
      }
    });
});
