// app.js
const express = require('express');
require('./db');
const bodyParser = require('body-parser');
const app = express();
const session = require('express-session');
const uuid = require('node-uuid');
let library = [];

const mongoose = require('mongoose');
const Movie = mongoose.model('Movie');

app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({ extended: false }));

const sessionOptions = { 
	secret: 'secret for signing session id', 
	saveUninitialized: false, 
	resave: false 
};
app.use(session(sessionOptions));

app.get('/movies', function(req, res) {
	let criteria = {};  
	if (typeof (req.query.director) !== 'undefined'  && (req.query.director).length>0){
	  	criteria = {director: req.query.director};
	  	console.log(criteria); 
	  }
	  //checks for valid sessionId -- if one does not exist, it creates one (like in part 1)
	  if(!req.session.sessionId){
	  	req.session.sessionId = uuid();
	  	//init library at the current id to an empty array
	  	library[req.session.sessionId] = [];
	  }

  Movie.find(criteria, function(err, movies, count) {
    if(err) {
      res.send(err); 
    }
    res.render( 'index', {
      movies: movies
    });
  });
});

app.get('/movies/add',  function(req, res) {
	res.render('add');
});

app.post('/movies/add', function(req, res) {
		new Movie({
		title: req.body.title,
		director: req.body.director,
		year: req.body.date
	}).save(function(err, movies, count){
		//adds to library at the current sessionId
		if (req.session.sessionId){
		library[req.session.sessionId].push(movies);
		}
		res.redirect('/movies');
	});
});

//part 6
app.get('/mymovies', function(req, res) {
	//checks if sessionId is valid
	if (req.session.sessionId){
		res.render('index', {movies: library[req.session.sessionId]});
	}
    else{
    	res.render('index');
    }
});

app.listen(3000);