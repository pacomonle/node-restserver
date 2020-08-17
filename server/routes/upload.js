const express = require('express');
// importar libreria de exppress file upload - ver basic example
const fileUpload = require('express-fileupload');
// importar modelos que tienen el atributo imagen
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
// librerias de express para el manejo de archivo como por ej. borrado
const fs = require('fs');
const path = require('path');

const router = express.Router();
// default options - ver documentacion libreria
router.use(fileUpload());


router.put('/upload/:tipo/:id', function(req, res) {

    const tipo = req.params.tipo;
    const id = req.params.id;

    if (!req.files) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No se ha seleccionado ningún archivo'
                }
            });
    }

    // Valida tipo
    const tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidas son ' + tiposValidos.join(', ')
            }
        })
    }
    //  {archivo : fileSubido} - mismo nombre que se use en el post o put
    const archivo = req.files.archivo;
    const nombreCortado = archivo.name.split('.');
    const extension = nombreCortado[nombreCortado.length - 1];

    // Extensiones permitidas
    const extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son ' + extensionesValidas.join(', '),
                ext: extension
            }
        })
    }

    // Cambiar nombre al archivo - el nombre debe de ser unico
    // 183912kuasidauso-123.jpg
   const nombreArchivo = `${ id }-${ new Date().getMilliseconds()  }.${ extension }`;
   // path relativo
   const path = `uploads/${ tipo }/${ nombreArchivo }`
           // console.log(path)
  // comando de express fle uploads para mover archivos
    archivo.mv( path , (err) => {

        if (err)
            return res.status(500).json({
                ok: false,
                msg: 'Error al mover la imagen',
                err
            });

        // Aqui, imagen cargada
        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);
        } else {
            imagenProducto(id, res, nombreArchivo);
        }

    });

});

const imagenUsuario = (id, res, nombreArchivo) => {

    Usuario.findById(id, (err, usuarioDB) => {

        if (err) {
            borraArchivo(nombreArchivo, 'usuarios');

            return res.status(500).json({
                ok: false,
                msg: 'Error al mover la imagen',
                err
            });
        }

        if (!usuarioDB) {

            borraArchivo(nombreArchivo, 'usuarios');

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        }

        borraArchivo(usuarioDB.img, 'usuarios')

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioGuardado) => {

            if(err){

              return  res.status(500).json({
                    ok: false,
                   msg: "error inesperado hable con el administrador"
                }) 
            }

            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            });

        });


    });


}



const imagenProducto = (id, res, nombreArchivo)  => {

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            borraArchivo(nombreArchivo, 'productos');

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {

            borraArchivo(nombreArchivo, 'productos');

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no existe'
                }
            });
        }

        borraArchivo(productoDB.img, 'productos')

        productoDB.img = nombreArchivo;

        productoDB.save((err, productoGuardado) => {

            if(err){

              return  res.status(500).json({
                    ok: false,
                   msg: "error inesperado hable con el administrador"
                }) 
            }

            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            });

        });


    });


}



const borraArchivo = (nombreImagen, tipo) => {

    const pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ nombreImagen }`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }


}

module.exports = router;