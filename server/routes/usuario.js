// importar libreria express
const express = require('express');
const router = express.Router();
// importar modelo 
const Usuario = require('../models/usuario');
// importar bcrypt para encriptar passwords
const bcrypt = require('bcrypt');
const saltRounds = 10;
// importar libreria para validaciones en el body de la req
const _ = require('underscore');



// rutas - se podria hacer con un controller en otro archivo
router.get('/usuario', function(req, res) {
  
// parametros opcionales - req.query
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);
    // el string es para filtrar que campos de la busqueda queremos devolver
    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
         // contar el total de resultados de la query
         // opcion 1
         //  Usuario.count({ estado: true }, (err, conteo) => { }
         // opcion 2
            Usuario.countDocuments({ estado: true }, (err, conteo) => {

                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                });

            });


        });
});

router.post('/usuario', function(req, res) {

    const body = req.body;

    const usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, saltRounds),
        role: body.role
    });

   // se podria hacer tambien con Usuario.create(usuarioDB, function (err, res))
    usuario.save((err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });


    });


});

router.put('/usuario/:id', function(req, res) {

    const id = req.params.id;
    const body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

// runVAlidators para hacer correr las validaciones en un put
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }



        res.json({
            ok: true,
            usuario: usuarioDB
        });

    })
});

router.delete('/usuario/:id', function(req, res) {
    const id = req.params.id;

    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
   
    // borrado logico
    const cambiaEstado = {
        estado: false
    };
    
    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });

    });

});


module.exports = router;