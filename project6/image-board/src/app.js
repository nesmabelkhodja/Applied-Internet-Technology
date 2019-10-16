const express = require('express');
require('./db');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const ImagePost = mongoose.model('ImagePost');
const Image = mongoose.model('Image');

app.use(express.static('public'))

app.set('view engine', 'hbs');

const path = require("path");
const publicPath = path.resolve(__dirname, "public");
app.use(express.static(publicPath));

// body parser setup
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.redirect('/image-posts');
});

app.get('/add', (req, res) => {
  res.redirect('/image-posts');
});


//displays all image posts
app.get('/image-posts', (req, res) => {
	ImagePost.find({}, function(err, imageposts, count) {
    if(err) {
      throw err; 
    }
	res.render('home', {posts: imageposts});
	});
});

//post new images
app.post('/add', function(req, res) {
		let imgs = []

		for (i=1; i<=3; i++){
			if (req.body['url'+i] !== ''){
				imgs.push(new Image({
					caption: req.body['comment'+i],
					url: req.body['url'+i]
				})
				);
			}
		}
		if (imgs.length === 0 || req.body.title === ''){
			res.render('home', {'error': "*Oops! Make sure you enter a unique title and least one URL!*"});	
		}

		else
		{
			new ImagePost({
				title: req.body.title,
				images: imgs
			}).save(function(err, imageposts, count){
			if (err){
				res.render('home', {'error': "*Oops! Make sure you enter a unique title and least one URL!*"});
			}
			res.redirect('/image-posts');
		});
		}
	
});

//slugs
app.get('/image-posts/:slug', function(req, res){
	ImagePost.findOne({slug: req.params.slug}, function(err, imageposts, count) {
		res.render('slug', {imgPost: imageposts, 'slug': imageposts.slug});
	});

});

app.post('/image-posts/:slug', function(req, res){
	ImagePost.findOne({slug: req.params.slug}, function(err, imageposts, count) {
		imageposts.images.push(new Image({
			caption: req.body.updatedCaption,
			url: req.body.updatedUrl
		}));
		imageposts.save(function(err, imageposts, count) {
			if (err){
				res.render('slug', {'slug': req.params.slug, 'error': "*Oops! Make sure you enter a URL!*"});
			}
			res.redirect('/image-posts/'+req.params.slug);
		});
	});
	
});

//delete
app.get('/image-posts/:slug/error', function(req, res){
	ImagePost.findOne({slug: req.params.slug}, function(err, imageposts, count) {
		res.render('slug', {imgPost: imageposts, 'slug': imageposts.slug, 'error': "*Oops! Make sure the image post still has at least one element!*"});	
	});
});

app.post('/image-posts/delete/:slug', function(req, res){
	ImagePost.findOne({slug: req.params.slug}, function(err, imageposts, count) {
		//if multiple boxes are checked
		if(Array.isArray(req.body.toDelete)){
      		//checks that there will be at least one image remaining in the post
		if (imageposts.images.length === (req.body.toDelete).length){
			res.redirect('/image-posts/'+imageposts.slug+'/error');
			return;
		}
		else{
      		for (i = 0; i<(req.body.toDelete).length; i++){
        		imageposts.images.id((req.body.toDelete)[i]).remove();
      		}
      	}
    	}
    	//if one box is checked and result is a single string
    	else {
    		if(req.body.toDelete){
    			//checks that the last element is not being deleted
				if (imageposts.images.length === 1){
					res.redirect('/image-posts/'+imageposts.slug+'/error');
					return;
				}
				else{
        			imageposts.images.id(req.body.toDelete).remove();
        		}
     		 }
    	}
		imageposts.save(function(err, imageposts, count) {
			if (err){
				res.redirect('/image-posts/'+imageposts.slug+'/error');
				return;			}
			res.redirect('/image-posts/'+imageposts.slug);
		});
	});
});

app.listen(3000);