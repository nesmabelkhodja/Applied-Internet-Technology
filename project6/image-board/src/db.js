const mongoose = require('mongoose')
const URLSlugs = require('mongoose-url-slugs');

// my schema goes here!
const Image = new mongoose.Schema({
  caption: {type: String, required: false},
  url: {type: String, required: true}
});

const ImagePost = new mongoose.Schema({
  title:  {type: String, required: true, unique: true},
  images: {type: [Image], required: true}
});

ImagePost.plugin(URLSlugs('title'));

mongoose.model('Image', Image);
mongoose.model('ImagePost', ImagePost);

mongoose.connect('mongodb://localhost/hw06');