// importar libreria express
const express = require('express');
const router = express.Router();
// importar modelo 
const Usuario = require('../models/usuario');
// importar bcrypt para encriptar passwords
const bcrypt = require('bcrypt');
// importar jwt
const jwt = require('jsonwebtoken');


router.post('/login', (req, res) => {
    const body = req.body;

    console.log(body.email)
// usamos findOne porque el email es unico
    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(Usuario) o contraseña incorrectos'
                }
            });
        }

       // comparar contraseñas con bcrypt
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o (contraseña) incorrectos'
                }
            });
        }

        const token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });


    });
})





module.exports = router;