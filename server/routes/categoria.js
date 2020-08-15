// importar libreria express
const express = require('express');
const router = express.Router();
// importar modelo 
const Categoria = require('../models/categoria');
// importar libreria para validaciones en el body de la req
const _ = require('underscore');
// importar middlewares
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');



// rutas - se podria hacer con un controller en otro archivo
// ============================
// Mostrar todas las categorias
// ============================
router.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({ })
        .sort('descripcion')
        .populate('usuario', 'nombre role email')
        .exec((err, categorias) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
        
            res.json({
                ok: true,
                categorias,
            });


        });


})

// ============================
// Mostrar una categoria por ID
// ============================
router.get('/categoria/:id', verificaToken, (req, res) => {
    // Categoria.findById(....);

    const id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El ID no es correcto'
                }
            });
        }


        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });


});



// ============================
// Crear nueva categoria
// ============================
router.post('/categoria', verificaToken, (req, res) => {

    const {descripcion} = req.body;
    const user = req.usuario;
    console.log(descripcion, user)

    const categoria = new Categoria({
        descripcion,
        usuario : user._id
    });

    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
      
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB,
        });


    });

})

// ============================
// Actualizar categoria
// ============================
router.put('/categoria/:id', verificaToken, (req, res) => {

    const id = req.params.id;
    const body = _.pick(req.body, ['descripcion']);
    const user = req.usuario
   // console.log(body)

  const descCategoria = {
    descripcion: body.descripcion,
    usuario: user._id
  };

// runVAlidators para hacer correr las validaciones en un put
Categoria.findByIdAndUpdate(id, descCategoria, { new: true }, (err, categoriaDB) => {

    if (err) {
        return res.status(500).json({
            ok: false,
            err
        });
    }

    if (!categoriaDB) {
        return res.status(400).json({
            ok: false,
            err
        });
    }

    res.json({
        ok: true,
        categoria: categoriaDB
    });

   });
});

// ============================
// Eliminar categoria
// ============================
router.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    // solo un administrador puede borrar categorias
    // Categoria.findByIdAndRemove
    const id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Categoria Borrada'
        });

    });


});

module.exports = router;