const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Bring in mongoose model, Place, to represent a restaurant
const Place = mongoose.model('Place');

// TODO: create two routes that return json
// GET /api/places
// POST /api/places/create
// You do not have to specify api in your urls
// since that's taken care of in app.js when
// this routes file is loaded as middleware
router.post('/places/create', (req, res) => {
			new Place({          
				'name':req.body.name,
				'cuisine':req.body.cuisine,
				'location':req.body.location
			}).save(function(err, places) {
				if(err){
          			console.log(err);
				}
       			res.json(places);
   			});
});

router.get('/places', (req, res) => {
	//if there are no specifications -- display all
    if((req.query.cuisine === '' || req.query.cuisine === undefined) && (req.query.location === '' || req.query.location === undefined)){
        Place.find({}, function(err, places) {
        	if (err){
        		console.log(err);
        	}
        	else{
            res.json(places.map(function(obj) {
                return {          
                    'name':obj.name, 'cuisine':obj.cuisine, 'location':obj.location
                }
            }));
        }
        });
    }
    //if query is speficied
     else if (((req.query.cuisine !== '' && req.query.cuisine !== undefined) && (req.query.location !== '' && req.query.location !== undefined))){
        Place.find({'cuisine': req.query.cuisine, 'location': req.query.location}, function (err, places) {
        	if (err){
        		console.log(err);
        	}
        	else{
            res.json(places.map(function(obj) {
                return {
                    'name':obj.name, 'cuisine':obj.cuisine, 'location':obj.location
                }
            }));
        }
        });
    }
    else if (req.query.cuisine !== '' && req.query.cuisine !== undefined){
        Place.find({'cuisine': req.query.cuisine}, function (err, places) {
        	if (err){
        		console.log(err);
        	}
        	else{
            res.json(places.map(function(obj) {
                return {
                    'name':obj.name, 'cuisine':obj.cuisine, 'location':obj.location
                }
            }));
        }
        });
    }
    else if (req.query.location !== '' && req.query.location !== undefined){
        Place.find({'location': req.query.location}, function (err, places) {
        	if (err){
        		console.log(err);
        	}
        	else{
            res.json(places.map(function(obj) {
                return {
                    'name':obj.name, 'cuisine':obj.cuisine, 'location':obj.location
                }
            }));
        }
        });
    }

});

module.exports = router;
