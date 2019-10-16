// db.js
var mongoose = require('mongoose'),
	URLSlugs = require('mongoose-url-slugs'); 

// my schema goes here!
const Movie = new mongoose.Schema({
  title: String,
  director: String,
  year: Number
});

mongoose.model('Movie', Movie);

mongoose.connect('mongodb://localhost/hw05');