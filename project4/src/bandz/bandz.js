// bandz.js
const express = require('express');
const app = express();
app.set('view engine', 'hbs');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));

const path = require("path");
const publicPath = path.resolve(__dirname, "public");
app.use(express.static(publicPath));

//global array to hold bands
let bandz = [{'name': 'Rihanna', 'location': 'Saint Michael Parish, Barbados', 'genre': 'Pop', 'description': '@rihanna is the fifth-most followed user on Twitter'}, 
{'name': 'Weezer', 'location': 'LA, California', 'genre': 'Rock', 'description': 'an American rock band formed in Los Angeles in 1992'}, 
{'name': 'Miles Davis', 'location': 'Alton, Illinois', 'genre': 'Jazz', 'description': 'an American jazz trumpeter, bandleader, and composer'}];

function toStringArr(bands){
	let strings = [];
	let curr = {}
	for (i = 0; i<bands.length; i++){
		curr = bands[i];
		strings[i] = curr.name + " ("+curr.genre+") - " + curr.description + " | " + curr.location;
	}
	return strings;
}


app.get('/', function(req, res) {
	  	let filtered = bandz;

	  	if (typeof (req.query.filterGenre) !== 'undefined'  && (req.query.filterGenre).length>0){
	  	const genre = req.query.filterGenre; 
  		
  		filtered =  bandz.filter(function(curr){
				if ((curr.genre === genre))
					return true;
				else 
					return false;
		});
  	}

  	let strings = toStringArr(filtered);
	res.render('home', {strings});
});

app.post('/', function(req, res) {
	let band = {
		'name': req.body.name,
		'location': req.body.location,
		'description': req.body.description,
		'genre': req.body.filterGenre
	};

	bandz.push(band);

	res.redirect('/');
});


app.listen(3000);