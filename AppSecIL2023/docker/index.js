const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/routes');
const oldroutes = require('./routes/oldroutes');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./openapi.json');
var { expressjwt: jwt } = require("express-jwt");
var path = require('path');
const clientDir = path.resolve(__dirname, 'public')
const user = null;
const mongoPort = 27017;
const mongoHost = '0.0.0.0';
const auth = user ? `${user}:${process.env.MONGO_PASS}@` : '';
const mongoString = `mongodb://${auth}${mongoHost}:${mongoPort}/testDatabase`;
const database = mongoose.connection;

//console.log(`Running node ${process.version}...`);
//console.log(`Connecting to DB... ${mongoString}`);
console.log(`Starting lab...`);

mongoose.connect(mongoString,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

database.on('error', (error) => {
    console.log("Could not connect to DB. FAILED!")
})

database.once('connected', () => {
    console.log('Database Connected! Enjoy!');
})
const app = express();

app.options('*', cors())

var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  const authHeader = req.get('Origin');
  if (authHeader) {
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  }else{
    corsOptions = { origin: "*" } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Authorization, Content-Type, Accept");
  next();
});

app.use(cors(corsOptionsDelegate));

app.use('/', express.static(clientDir));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(
    jwt({
      secret: "secret",
      algorithms: ["HS256"]
    }).unless({ path: [/\/api\/v2\/admin\/posts\/comments\/([^\/]*)$/,/\/api\/v2\/admin\/posts\/([^\/]*)$/,/\/api\/v2\/posts\/comments\/([^\/]*)$/,/\/api\/v2\/posts\/([^\/]*)$/,/\/api\/v2\/me\/profile\/card\/([^\/]*)$/,/\/api\/v1\/me\/profile\/card\/([^\/]*)$/,/\/api\/v2\/blog\/users\/([^\/]*)$/,/\/public\/([^\/]*)$/,"/api/v2/login","/api/v2/signup","/api/v2/dev/token","/api/v2/reset_pwd","/api/v2/blog/users","/api/v2/posts","/api/v1/blog/users","/api/v2/categories","/api/v2/admin/categories","/","/favicon.ico","/api/v2/signup","/api/v2/logging"] })
);

const errorHandler = (error, request, response, next) => {
    console.log( `error ${error.message}`);
    const status = error.status || 400;
    response.status(status).send({"error": error.message});
}
  
app.use(express.json());

app.use('/api/v2/', routes);
app.use('/api/v1/', oldroutes);

app.use(errorHandler);

app.listen(3000, () => {
    console.log(`Application listening in http://localhost:${3000}`)
    console.log("Loading DB...")
})