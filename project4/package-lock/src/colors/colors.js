// colors.js

var express = require('express');
const app = express();
const path = require("path");
const bodyParser = require('body-parser');
Object.assign(global, require('../colors/colorlib.js'));

let red = '';
let blue = '';
let green = '';
let total = "";

//read and store colors.txt
let colors = {};
const fs = require('fs');
fs.readFile(path.resolve(__dirname, path.resolve("../colors/colors.txt")), {'encoding': 'utf8'}, function read(err, data) {
    if (((err)))
    	throw err;

    const obj = data.trim().split("\n");
    let line =  [];
    for (i =0; i<obj.length; i++){
    	line = (obj[i]).split(',');

    	colors[line[1]] = line[0];
	}
  });

const publicPath = path.resolve(__dirname, "public");
app.use(express.static(publicPath));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(function(req, res, next) {
	next();
});

app.set('view engine', 'hbs');

//redirects to /colors
app.get('/', function(req, res) {
   res.redirect('/colors');
});


	//function that creates a string with the hex, color name, and rgb value
function toString(color){
	let hex = color.hex;
	if ((hex+'\r') in colors){
		let name = colors[hex+'\r'];
		return name + " " + hex + " ("+color.r+", "+color.g+", "+color.b+")";
	}
	else
		return hex + " ("+color.r+", "+color.g+", "+color.b+")";
		
	};

//when path is /colors
app.get('/colors', function(req, res) {
	if (typeof (req.query.red) !== 'undefined' && typeof (req.query.green) !== 'undefined' && typeof (req.query.blue) !== 'undefined' && typeof (req.query.total) !== 'undefined') {
    red = req.query.red;
	blue = req.query.blue;
	green = req.query.green;
	total = req.query.total;
}
	else{
		res.render('home');
	}
    //makes sure values are valid and if not displays error message
    if ((red <0 || red > 255) || (blue <0 || blue > 255) || (green <0 || green > 255) || (total <2 || total > 10))
    	res.render('home', {'message': "Oops! The values for Red, Blue, and Green must all be between 0 and 255. \nThe number of shades should be between 2 and 10."});

    //if inputs are valid\
    else{
    	//creates an array of different shades
    	let shades = {};
    	shades[toString(new Color(red, green, blue))]= (new Color(red, green, blue)).hex;

    	let num = total;
    	let col;
    	while (num - 1 > 0){
    		col = new Color(Math.ceil(Math.random() * (255 - red) + red), Math.ceil(Math.random() * (255 - green) + green), Math.ceil(Math.random() * (255 - blue) + blue));
    		shades[toString(col)] = col.hex;
    		num --;
    	}

    	res.render('home', {'red':red, 'blue':blue, 'green':green, 'total':total, 'shades':shades});
   } 		

});


//about page
app.get('/about', function(req, res) {
    res.render('about');
});

app.listen(3000);

