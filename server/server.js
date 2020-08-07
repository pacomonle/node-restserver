// importar archivo config
require('./config/config');
// importar libreria mongoose
const mongoose = require('mongoose');
// importar libreria express
const express = require('express');
const app = express();

const bodyParser = require('body-parser');

// los app.use son middleware

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


// conectar a las rutas - configuracion global
app.use(require('./routes/index'));


// conectar con la base de datos - mongodb
const options = {
    useNewUrlParser: true, useCreateIndex: true,  useUnifiedTopology: true,  useFindAndModify: false 
  }

mongoose.connect(process.env.URLDB, options).then(
     () =>  console.log('Base de datos Mongodb ONLINE'),
     err => console.log(err)
    );




app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});