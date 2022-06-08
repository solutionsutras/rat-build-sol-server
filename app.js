const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
var favicon = require('serve-favicon')
var path = require('path')

app.use(favicon(path.join(__dirname, 'public', 'favicon.png')))

require('dotenv/config');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/errorHandler');

app.use(cors());
app.options('*', cors());

// Middleware
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use(errorHandler)

// Routes
const categoriesRouter = require('./routers/categories');
const itemdetailsRouter = require('./routers/itemdetails');
const usersRouter = require('./routers/users');
const ordersRouter = require('./routers/orders');

const api= process.env.API_URL;

//Routers
app.use(`${api}/itemdetails`,itemdetailsRouter)
app.use(`${api}/categories`,categoriesRouter)
app.use(`${api}/users`,usersRouter)
app.use(`${api}/orders`,ordersRouter)

mongoose.connect(process.env.CONNECTION_STRING,{
    useunifiedTopology:false,
})
.then(()=>{
    console.log('Database Connection Sucessfull')
})
.catch((err)=>{
    console.log('Database Conenction Error: ' + err);
})

// Development
// app.listen(3000, ()=>{
//     console.log("Server Running at http://3000")
// })

// Production
	var server = app.listen(process.env.PORT || 3000, function(){
    var port = server.address().port;
    console.log("Server Running at port: " + port)
})