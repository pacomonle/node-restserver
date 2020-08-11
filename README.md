# npm init
# npm i --save express
# instalar nodemon y script de developer -dev en el package.json

#########

# npm i mongoose - para conectar con mongodb
# npm i mongoose-unique-validator - para validaciones de valor unico
# npm i bcrypt - para encriptar contraseñas
# npm i underscore - para hacer validaciones en el body de la req

#########

# npm update -> para actualizar todos los paquetes de node
# npm uninstall bcrypt / npm i bcrypt

#########

# crear repositorio github
# subir repositorio
# .gitignore - node_modules/
# git init
# git status
# git add .
# git status
# git commit -m "first commit"
# git remote add origin https://github.com/pacomonle/node-rest-server.git
# git push -u origin master
# git tag -a v.0.0.1 -m "beta"
# git push --tags

#  heroku git:remote -a nodejs-rest-server-nolito
# git remote o git remote -v
# git push heroku master
# heroku open - abrir pagina web
# script start para que heroku sepa donde iniciar la app

# heroku config
# heroku config:set <nombre-personalizado>
  heroku config:set MONGO_URI='mongodb+srv://NolitoxD:Aredbull71@cluster0.3pn1s.mongodb.net/cafe'
# heroku config:get <nombre-personalizado>
# heroku config:unset <nombre-personalizado>

#########

jwt -autentication

#########

# npm i jsonwebtoken
# carpeta middlewares / archivo autenticacion.js
# todos los datos del usuario van en la req.usuario - decode

########

# ver archivo de .txt con los pasos a seguir o seccion 11 curso Udemy
# validar token google - npm i google-auth-library
   const {OAuth2Client} = require('google-auth-library');
   const client = new OAuth2Client(CLIENT_ID);
   crear varaiable de entronode google id - CLIENT_ID
# configuraciones de google
  async function verify() {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  const userid = payload['sub'];
  // If request specified a G Suite domain:
  // const domain = payload['hd'];
}
verify().catch(console.error);