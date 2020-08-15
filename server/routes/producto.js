const express = require('express');
const router = express.Router();

const { verificaToken } = require('../middlewares/autenticacion');

const _ = require('underscore');

const Producto = require('../models/producto');

// ===========================
//  Obtener productos
// ===========================
router.get('/productos', verificaToken, (req, res) => {
    // trae todos los productos
    // populate: usuario categoria
    // paginado
    let desde = req.query.desde || 0;
    desde = Number(desde);
    
    Producto.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email role')
        .populate('categoria', 'nombre descripcion')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            });


        })

})

// ===========================
//  Obtener un producto por ID
// ===========================
router.get('/productos/:id', verificaToken, (req, res) => {
    // populate: usuario categoria

    const id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email role')
        .populate('categoria', 'nombre descripcion')
        .exec((err, productoDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'ID no existe'
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            });

        });

})

// ===========================
//  Crear un nuevo producto
// ===========================
router.post('/productos', verificaToken, (req, res) => {
    // grabar el usuario
    // grabar una categoria del listado 
    const body = req.body;

    

    const producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
    });

    producto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        });

    });


})

// ===========================
//  Actualizar un producto
// ===========================
router.put('/productos/:id', verificaToken, (req, res) => {
    // grabar el usuario
    // grabar una categoria del listado 
    
    const id = req.params.id;
    const body = req.body;

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            });
        }

        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;
        productoDB.descripcion = body.descripcion;
        productoDB.usuario = req.usuario._id;

        productoDB.save((err, productoGuardado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoGuardado
            });

        });

    });


})

// ===========================
//  Borrar un producto
// ===========================
router.delete('/productos/:id', verificaToken, (req, res) => {

    const id = req.params.id;

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'ID no existe'
                }
            });
        }

        productoDB.disponible = false;
        productoDB.usuario = req.usuario._id;

        productoDB.save((err, productoBorrado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoBorrado,
                mensaje: 'Producto borrado'
            });

        })

    })

})

// ===========================
//  Buscar productos
// ===========================
router.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    const termino = req.params.termino;

    const regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex})
        .populate('categoria', 'nombre')
        .exec((err, productos) => {


            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            })

        })

})


module.exports = router;