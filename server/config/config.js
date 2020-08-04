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
    urlDB = 'mongodb+srv://NolitoxD:Aredbull71@cluster0.3pn1s.mongodb.net/cafe'
    // urlDB = process.env.MONGO_URI - en la nube
}
process.env.URLDB = urlDB;