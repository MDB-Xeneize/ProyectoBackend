require('rootpath')();

var inOut_db = {};

const { query } = require('express');
const mysql = require('mysql');
const configuracion = require("config.json");
const { param } = require('../controller/choferController');


var connection = mysql.createConnection(configuracion.database);
connection.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("base de datos conectada");
    }
});

inOut_db.getAll = function (funCallback) {
    var consulta = 'select * FROM viaje as V inner join tipo_viaje as TV on V.id_tipo=TV.id_tipo inner join vehiculo as VH on V.id_vehiculo=VH.id_vehiculo order by id_viaje;';
    connection.query(consulta, function (err, rows) {
        if (err) {
            funCallback(err);
            return;
        } else {
            funCallback(undefined, rows);
        }
    });
}



inOut_db.getAllChofer = function (funCallback) {
    var consulta = 'select id_chofer,dni,nombre,apellido from chofer';

    connection.query(consulta, function (err, rows) {
        if (err) {
            funCallback(err);
            return;
        } else {
            funCallback(undefined, rows);
        }
    });
}

inOut_db.getAllVehiculo = function (funCallback) {
    var consulta = 'select id_vehiculo,matricula,marca,modelo FROM vehiculo;';
    connection.query(consulta, function (err, rows) {
        if (err) {
            funCallback(err);
            return;
        } else {
            funCallback(undefined, rows);
        }
    });
}

inOut_db.getByIdViaje = function (id_viaje_busca,funCallback) {
    consulta = 'select * FROM viaje as V inner join tipo_viaje as TV on V.id_tipo=TV.id_tipo inner join vehiculo as VH on V.id_vehiculo=VH.id_vehiculo where id_viaje=?;';
    params = id_viaje_busca;
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



inOut_db.create = function (registro, funcallback) {
    consulta ="insert into tipo_viaje (carga,nombre) values (?,?);";
    params = [registro.carga,registro.nombre];
    
    connection.query(consulta, params, (err, result) => {
        if (err) {

            return connection.rollback(function() {
                throw err;
              });
    
        }
        const id_tipo = result.insertId;
    
        consulta = "INSERT INTO viaje (destino, fecha, peso_total, origen, hora, id_chofer, id_vehiculo, id_tipo) VALUES (?,?,?,?,?,?,?,?);";
        params = [registro.destino, registro.fecha, parseInt(registro.peso_total) , registro.origen, registro.hora , parseInt(registro.id_chofer) ,parseInt(registro.id_vehiculo), parseInt(id_tipo) ];
        
        connection.query(consulta, params, (err, detail_bd) => {
            if (err) {
    
                if (err.code == "ER_DUP_ENTRY") {
                    funcallback({
                        mensaje: "registro ya existente",
                        detalle: err
                    });
                } else {
                    funcallback({
                        mensaje: "error en la DB",
                        detalle: err
                    });
                }
            } else {
                const id_viaje = detail_bd.insertId;
                funcallback(undefined, {
                    mensaje: "se registro " + registro.nombre+" con ID "+ id_viaje,
                    detalle: detail_bd
               });
            }
        });

    });
    
    
}

inOut_db.modificar=function actualizarRegistros(registroPut, idViajePut, callback) {
    const sql1 = 'UPDATE tipo_viaje SET carga = ?, nombre = ? WHERE id_tipo = ?';
    const params1 = [registroPut.carga, registroPut.nombre, registroPut.id_tipo];
  
    connection.query(sql1, params1, function(err1, result1) {
      if (err1) {
        callback(err1, null);
      } else {
        const sql2 = 'UPDATE viaje SET destino=?, fecha=?, peso_total=?, origen=?, hora=?, id_chofer=?, id_vehiculo=?, id_tipo=? WHERE id_viaje=?';
        const params2 = [registroPut.destino, registroPut.fecha, parseInt(registroPut.peso_total), registroPut.origen, registroPut.hora, parseInt(registroPut.id_chofer), parseInt(registroPut.id_vehiculo), parseInt(registroPut.id_tipo), parseInt(idViajePut)];
  
        connection.query(sql2, params2, function(err2, result2) {
          if (err2) {
            callback(err2, null);
          } else {
            callback(null,  {
                mensaje: "se modifico registro ",
                detalle: result2
           });
          }
        });
      }
    });
  }
  

inOut_db.borrar = function (id_viaje_borrar,id_tipo_borrar,seleccionJSON , funCallback) {
     
    params1 = parseInt(id_viaje_borrar);
    params2 = parseInt(id_tipo_borrar);
    console.log(id_tipo_borrar,id_viaje_borrar,seleccionJSON);
    consulta1 = "DELETE FROM viaje WHERE id_viaje = ?;";
    consulta2 = "DELETE FROM tipo_viaje WHERE id_tipo = ?;";

    if(Object.keys(seleccionJSON).length !== 0){
        
        const claves = Object.keys(seleccionJSON);
        let idsTipo=[]
        let idsViaje=[]
        let consultamulti1="DELETE FROM viaje WHERE id_viaje in ("
        let consultamulti2="DELETE FROM tipo_viaje WHERE id_tipo in ("
        for (let i = 0; i < claves.length; i++) {
            const clave = claves[i];
            idsTipo[i]= seleccionJSON[claves[i]][1];
            consultamulti2+='?,';
        }
        if (idsTipo.length > 0) {
            consultamulti2= consultamulti2.slice(0,-1);
            consultamulti2= consultamulti2+");";
        }
        for (let i = 0; i < claves.length; i++) {
            const clave = claves[i];
            idsViaje[i]= seleccionJSON[claves[i]][0];
            consultamulti1+='?,';
        }
        if (idsViaje.length > 0) {
            consultamulti1= consultamulti1.slice(0,-1);
            consultamulti1= consultamulti1+");";
        }
        const consulta1 = consultamulti1;
        console.log(consulta1)
        params1=idsViaje;
        console.log(params1)
        const consulta2 = consultamulti2;
        console.log(consulta2)
        params2=idsTipo;
        console.log(params2)
    }
 
    

    connection.query(consulta1 , params1, function(err1, result1) {
      if (err1) {
        funCallback(err1, null);
      } else {
   
        
        connection.query(consulta2, params2, function(err2, result2) {
            if (err2) {
                funCallback({ message: err.code, detail: err });
            } else {
                if (result2.affectedRows === 0) {
                    funCallback(undefined, {
                        message: "No se encontró el registro del ID_Viaje ingresado",
                        detail: result2
                    });
                } else {
                    funCallback(undefined, { message: "Registro de viaje eliminado", detail: result2 });
                }
            }
        });
      }
    });
}  

// inOut_db.borrar = function (id_viaje_borrar, id_tipo_borrar, seleccionJSON, funcallback) {
//     const consultas = [];

//     if (seleccionJSON !== undefined) {
//         const claves = Object.keys(seleccionJSON);
//         let idsTipo = [];
//         let idsViaje = [];

//         for (let i = 0; i < claves.length; i++) {
//             const clave = claves[i];
//             idsTipo.push(seleccionJSON[clave][1]);
//             idsViaje.push(seleccionJSON[clave][0]);
//         }

//         if (idsTipo.length > 0) {
//             const consultaMultiTipo = "DELETE FROM tipo_viaje WHERE id_tipo IN (?)";
//             consultas.push({ consulta: consultaMultiTipo, params: [idsTipo] });
//         }

//         if (idsViaje.length > 0) {
//             const consultaMultiViaje = "DELETE FROM viaje WHERE id_viaje IN (?)";
//             consultas.push({ consulta: consultaMultiViaje, params: [idsViaje] });
//         }
//     }

//     connection.beginTransaction(function (err) {
//         if (err) {
//             funcallback(err, null);
//             return;
//         }

//         const totalConsultas = consultas.length;
//         let consultasEjecutadas = 0;

//         consultas.forEach((consultaObj) => {
//             connection.query(consultaObj.consulta, consultaObj.params, function (err, result) {
//                 consultasEjecutadas++;

//                 if (err) {
//                     connection.rollback(function () {
//                         funcallback(err, null);
//                     });
//                 } else if (consultasEjecutadas === totalConsultas) {
//                     connection.commit(function (commitErr) {
//                         if (commitErr) {
//                             connection.rollback(function () {
//                                 funcallback(commitErr, null);
//                             });
//                         } else {
//                             funcallback(null, {
//                                 mensaje: "Se borraron registros con éxito",
//                                 detalle: result
//                             });
//                         }
//                     });
//                 }
//             });
//         });
//     });
// };

// inOut_db.modificar = function (registro_put,id_viaje_put, funcallback) {
//     consulta = "UPDATE tipo_viaje SET carga= ?,nombre= ?   WHERE id_tipo = ?;";
//     params = [registro_put.carga,registro_put.nombre,registro_put.id_tipo];

//     connection.query(consulta, params, (err, resultado) => {
//         if (err) {
//             funcallback({
//                 mensaje: err.code,
//                 detail: err},
//                 undefined
//                 );
            
//         }  
//         else {
//             funcallback(undefined,{
//                 mensaje:"registro tipo modificado",
//                 detail: resultado 
//             });   
//         }
//     })
    
//         consulta = "UPDATE viaje SET destino=?, fecha=?, peso_total=?, origen=?, hora=?, id_chofer=?, id_vehiculo=?, id_tipo=? WHERE id_viaje=?;";
//         params = [registro_put.destino, registro_put.fecha, parseInt(registro_put.peso_total) , registro_put.origen, registro_put.hora , parseInt(registro_put.id_chofer) ,parseInt(registro_put.id_vehiculo), parseInt(registro_put.id_tipo),parseInt(id_viaje_put) ];
        
//         connection.query(consulta, params, (err, resultado) => {
//             if (err) {
//                 funcallback({
//                     mensaje: err.code,
//                     detail: err},
//                     undefined
//                     );
                
//             }  
//             else {
//                 funcallback(undefined,{
//                     mensaje:"registro viaje modificado",
//                     detail: resultado 
//                 });   
//             }
//         });

    
    
    
// }


module.exports = inOut_db;