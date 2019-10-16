const express = require('express');
require('./db');
require('./auth');
const passport = require('passport');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const Chart = mongoose.model('Chart');
const Song = mongoose.model('Song');
const User = mongoose.model('User');

const path = require("path");
const publicPath = path.resolve(__dirname, "public");
app.use(express.static(publicPath));
app.set('view engine', 'hbs');

// serve static files
app.use(express.static(path.join(__dirname, 'public')));

// body parser setup
app.use(bodyParser.urlencoded({ extended: false }));

const session = require('express-session');
const sessionOptions = {
	secret: 'secret cookie thang (store this elsewhere!)',
	resave: true,
	saveUninitialized: true
};
app.use(session(sessionOptions));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.initialize());
app.use(passport.session());

//________________________________________________________________________________________________
let username = {};

app.get('/', function (req, res) {
  res.redirect('/login');
});

app.get('/about', function (req, res) {
  res.render('about');
});

app.get('/feedback', function (req, res) {
	if (username.username===undefined){
		res.render('home', {error: 'Please log in to leave us feedback.'});
	}
  res.render('feedback', {user: username.username});
});

app.post('/feedback', function (req, res) {
	res.render('home', {error: 'Thank you for your feedback.'});
});

app.get('/login', function(req, res) {
	res.render('login');
});

app.post('/login', function(req,res,next) {
  passport.authenticate('local', function(err,user) {
    if(user) {
      req.logIn(user, function(err) {
      	username = user;
        res.redirect('/charts');
      });
    } else {
      res.render('login', {message:'Your login or password is incorrect.'});
    }
  })(req, res, next);
});

app.post('/register', function(req, res) {
  User.register(new User({username:req.body.username}), 
      req.body.password, function(err, user){
    if (err) {
      res.render('register',{message:'Your registration information is not valid'});
    } else {
      passport.authenticate('local')(req, res, function() {
        res.redirect('/');
      });
    }
  });   
});

app.get('/register', function(req, res) {
  res.render('register');
});

app.get('/logout',function(req, res){
    req.logout();
    username = {};
  	username.username = undefined;
    res.redirect('/');
  });

app.get('/charts', (req, res) => {
	if (username.username===undefined){
		res.render('home', {error: 'You must be logged in to access your charts.'});
	}
	else{
	Chart.find({user:username}, function(err, charts, count) {
    if(err) {
      throw err; 
    }
    if (charts === undefined){
    	res.render('home', {error:"Oops! You don't have any charts yet."});
    }
    else{
		res.render('home', {charts: charts, user:username,username});
    }
	});
}
});


app.get('/charts/create', (req, res) => {
	if (username.username===undefined){
		res.render('home', {error: 'You must be logged in to access your charts.'});
	}
	else{
		res.render('create');
	}
});

app.post('/charts/create', (req, res) => {
  	if (username === {}){
		res.render('home', {error: 'You must be logged in to access your charts.'});
	}
	else{
  	let songs = []
		for (i=1; i<=15; i++){
			if (req.body['artist'+i] !== '' && req.body['title'+i] !== ''){
				songs.push(new Song({
					artist: req.body['artist'+i],
					title: req.body['title'+i],
					album: req.body['album'+i],
					label: req.body['label'+i],
					plays: 1
				})
				);
			}
		}
		if (songs.length === 0 || req.body.title === ''){
			console.log("error");
		}
		else
		{
			new Chart({
				user: username,
				title: req.body.title,
				playlist: songs,
				createdAt: (new Date().getMonth()+1)+'/'+new Date().getDate()+' at '+new Date().getHours()+':'+new Date().getMinutes()
			}).save(function(err, charts, count){
			if (err){
				console.log("error", err);
			}
			res.redirect('/charts');
		});
		}
	}
});

app.get('/charts/:slug', function(req, res){
	if (username === {}){
		res.render('home', {error: 'You must be logged in to access your charts.'});
	}
	else {
		Chart.findOne({slug: req.params.slug}, function(err, charts, count) {
		const total = getTotalPlays(charts.playlist);
		const playlist = updateCounts(charts.playlist);
		console.log("update", playlist);
		charts.playlist = playlist;
		res.render('slug', {charts: charts, user:username, total:total});
	});
}

});

app.post('/charts/:slug', function(req, res){
	Chart.findOne({slug: req.params.slug}, function(err, charts, count) {
		charts.playlist.push(new Song({
			artist: req.body.newArtist,
			title: req.body.newTitle,
			album: req.body.newAlbum,
			label: req.body.newAlbum,
			plays: 1
		}));
		charts.save(function(err, charts, count) {
			if (err){
				res.render('slug', {'slug': req.params.slug, 'error': "*Error*"});
			}
			res.redirect('/charts/'+req.params.slug);
		});
	});
	
});

//delete
app.post('/charts/delete/:slug', function(req, res){
	Chart.findOne({slug: req.params.slug}, function(err, charts, count) {
		//if multiple boxes are checked
		if(Array.isArray(req.body.toDelete)){
      		//checks that there will be at least one song remaining in the post
		if (charts.playlist.length === (req.body.toDelete).length){
			res.redirect('/charts/'+charts.title+'/error');
			return;
		}
		else{
      		for (i = 0; i<(req.body.toDelete).length; i++){
        		charts.playlist.id((req.body.toDelete)[i]).remove();
      		}
      	}
    }
    	//if one box is checked and result is a single string
    	else {
    		if(req.body.toDelete){
    			//checks that the last element is not being deleted
				if (charts.playlist.length === 1){
					res.redirect('/charts/'+charts.title+'/error');
					return;
				}
				else{
        			charts.playlist.id(req.body.toDelete).remove();
        		}
     		 }
    	}
		charts.save(function(err, charts, count) {
			if (err){
				console.log(err);
				return;			
			}
			res.redirect('/charts/'+charts.slug);
		});
	});
});

function total(total, song){
	return total + song;
}

function getTotalPlays(database){
	const arr = getArrayOfPlays(database);

	let totalPlays = arr.reduce(total);
	return totalPlays;
}

function getArrayOfPlays(database){
	const arr = database.map(function(song){
		return song.plays;
	});

	return arr;
}

function existsInArray(database, index){
	let result = -1;
	for(i=0; i<index; i++){
		if (database[i].title === database[index].title){
			result = i;
			i=index;
		}
	}
	return result;
}

//sorting mechanism
function updateCounts(database){
	let index;
	let counter = 0;
	database.forEach(function(song){
		index = existsInArray(database, counter);
		if (index !== -1){
			console.log("index", index, "plays", song.plays, database[index].plays);
			database[index].plays+=song.plays;
			song.plays = 0;
		}
		counter++;
	});

	let chart = database.filter(function(song){
		if (song.plays >0)
			return true;
		else
			return false;
	});

	database = chart;
	return database;
}



app.listen(process.env.PORT || 3000);