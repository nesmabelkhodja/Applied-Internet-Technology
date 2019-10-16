const mongoose = require('mongoose');
const passport = require('passport-local-mongoose');
const URLSlugs = require('mongoose-url-slugs');
// users
// * our site requires authentication...
// * so users have a username and password
const User = new mongoose.Schema({
  // username provided by authentication plugin
  // password hash provided by authentication plugin
  charts:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chart' }]
});

// a song in a playlist or chart
const Song = new mongoose.Schema({
  artist: {type: String, required: true},
  title: {type: String, required: true},
  album: {type: String},
  label: {type: String},
  plays: {type: Number, min: 1, required: true}
});

// a top 30 chart
// * each chart must have a related user
const Chart = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
  title: {type: String, required: true},
  createdAt: {type: String, required: true},
  playlist: [Song]
});

User.plugin(passport);
Chart.plugin(URLSlugs('title'));

mongoose.model('User', User);
mongoose.model('Song', Song);
mongoose.model('Chart', Chart);

let dbconf;

// is the environment variable, NODE_ENV, set to PRODUCTION? 
if (process.env.NODE_ENV === 'PRODUCTION') {
 // if we're in PRODUCTION mode, then read the configration from a file
 // use blocking file io to do this...
 const fs = require('fs');
 const path = require('path');
 const fn = path.join(__dirname, 'config.json');
 const data = fs.readFileSync(fn);

 // our configuration file will be in json, so parse it and set the
 // conenction string appropriately!
 const conf = JSON.parse(data);
 dbconf = conf.dbconf;
} else {
 // if we're not in PRODUCTION mode, then use
 dbconf = 'mongodb://localhost/finalProj';
}



mongoose.connect(dbconf);