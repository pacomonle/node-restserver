// importar libreria express
const express = require('express');
const router = express.Router();
// importar modelo 
const Usuario = require('../models/usuario');
// importar bcrypt para encriptar passwords
const bcrypt = require('bcrypt');
// importar jwt
const jwt = require('jsonwebtoken');
// importar libreria de google
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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

// configuraciones de google
// añadir como argumento el token
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    console.log(payload)
    const userid = payload['sub'];
    // If request specified a G Suite domain:
    // const domain = payload['hd'];
    return {
        // segun nuestro model usuario
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
  }
 // verify().catch(console.error);

// ruta login google

router.post('/google', async (req, res) =>{
 // recuperar token de google del body
  const token = req.body.idtoken
 // verify es una promesa para asignarlo necesitamos el await 

 try {
    const googleUser = await verify(token)
/* comprobaciones
    res.json({
        usuario: googleUser
       // token    
    })
*/
    // verificar que el usuario no existe

     Usuario.findOne({email: googleUser.email}, (err, usuarioDB) =>{
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if ( usuarioDB) {

            if(usuarioDB.google === false){
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Usuario autenticado con email y password'
                    }
                });
            }else{
                // renovar token
                const token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });
            }
           
        }else{
            // el usuario se autentica por google por primera vez
            const usuario = new Usuario({
                nombre: googleUser.nombre,
                email: googleUser.email,
                img: googleUser.img,
                google: true,
                password: ':)' // por validaciones el password es obligatorio 
            });
            // grabar en base de datos
            usuario.save((err, usuarioDB) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
                    // renovar token
                    const token = jwt.sign({
                        usuario: usuarioDB
                    }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });
                    
                res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });
        
        
            });
        }

     })



 } catch (error) {
     res.status(401).json({
         ok: false,
         error
     })
 }
 
  
})



module.exports = router;