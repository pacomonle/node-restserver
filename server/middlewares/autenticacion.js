// importar libreria jwt
const jwt = require('jsonwebtoken');


// =====================
// Verificar Token
// =====================
const verificaToken = (req, res, next) => {

    const token = req.get('token'); // buscar en los headers el 'token' o en su caso 'Authorization'
   // console.log(token)
    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();

    });



};

// =====================
// Verifica AdminRole
// =====================
const verificaAdmin_Role = (req, res, next) => {
  
    const usuario = req.usuario;

    if (usuario.role === 'ADMIN') {
        next();
    } else {

        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }
    
};



module.exports = {
    verificaToken,
    verificaAdmin_Role
}