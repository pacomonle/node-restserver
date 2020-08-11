// ============================
//  Puerto
// ============================
process.env.PORT = process.env.PORT || 3000;



// ============================
//  Entorno
// ============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// ============================
//  Base de datos
// ============================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    // urlDB - local
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
   // urlDB = 'mongodb+srv://NolitoxD:Aredbull71@cluster0.3pn1s.mongodb.net/cafe'
    urlDB = process.env.MONGO_URI 
}
process.env.URLDB = urlDB;


// ============================
//  Vencimiento del Token
// ============================
// 60 segundos
// 60 minutos
// 24 horas
// 30 días
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;


// ============================
//  SEED de autenticación
// ============================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';


// ============================
//  Google Client ID
// ============================
process.env.CLIENT_ID = process.env.CLIENT_ID || '606365688940-r5t676bfjv31vvfg3t4gp8eqnlegbros.apps.googleusercontent.com';