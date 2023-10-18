require('rootpath')();
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//const router = express.Router();



var personaDb = require("model/persona.js");

//modifique los endpoint de manera que se ejecute la consulta apropiada en el Model
//ya que al crear varios endpoint con el metodo GET
//que requerian parametros me surgio un problema y lo resolvi asi


app.get('/', (req, res) => {
    
    personaDb.getAll((err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(resultado);
        }
    });

});





app.get('/usuario/:persona',(req, res) => {
    
    params = req.params.persona;
    personaDb.getByUser(params, (err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(resultado.mensaje);
            //res.json(resultado);
           
        }
    });
});


app.get('/apellido/:apellido', (req, res) => {
    console.log("aca");
    params = req.params.apellido;
    personaDb.getByApellido(params,(err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else{
            res.json(resultado);
        }
    });
});


app.get('/dni/:dni', (req, res) => {
    params = req.params.dni;
    personaDb.getdni(params,(err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else{
            res.json(resultado);
        }
    });
});













//---------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------


app.post('/', (req, res) => {

    let persona = req.body;
    personaDb.create(persona, (err, resultado) => {
        if (err) {
            res.status(500).send(err);
        } else {
            //res.send(rows);
            res.send(resultado);
        }
    });

});


app.delete('/:dni' , (req, res) => {
    let dni_borrar = req.params.dni;
    personaDb.borrar(dni_borrar, (err ,resultado) => {
        if (err){
            res.status(500).send(err);
        }
        else{
            res.send(resultado);
        }
    });
});


app.put('/:dni' , (req, res) => {
    let persona_putear = req.body;
    let dni_putear = req.params.dni;
    personaDb.modificar(persona_putear,dni_putear, (err ,resultado) => {
        if (err){
            res.status(500).send(err);
        }
        else{
            res.send(resultado);
        }
    });
});



module.exports = app;
//module.exports = router;

