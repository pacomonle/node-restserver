const express = require('express');

const fs = require('fs');
const path = require('path');

const { verificaTokenImg } = require('../middlewares/autenticacion');


const router = express.Router();

// para hacer un parametro opcional *?
router.get('/imagen/:tipo/:img*?', verificaTokenImg, (req, res) => {


    const tipo = req.params.tipo;
    const img = req.params.img;
    // necesitamos el path de la imagen para mostrarla - el path debe de ser absoluto
    const pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ img }`);

    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        // mostrar imagen por defecto si no existe ninguna
        // el path debe de  ser absoluto
        const noImagePath = path.resolve(__dirname, '../assets/no-image.jpg');
        res.sendFile(noImagePath);
    }



});





module.exports = router;