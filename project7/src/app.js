const express = require('express');
const app = express();
app.set('view engine', 'hbs');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));

const path = require("path");
const publicPath = path.resolve(__dirname, "public");
app.use(express.static(publicPath));

//const index = require('./routes/index');
//app.use('/', '/public/index.html');

app.use(express.static('public'))

// //homepage
// app.get('/', function(req, res) {
//   res.sendFile("/public/index.html");
// });

app.listen(3000);