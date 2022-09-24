/*
####################
This page is only for import data easior, not a part of the final project
*/



/*

const express = require('express');
const mongoose = require('mongoose');
const Game = mongoose.model('Game');
const Image = mongoose.model('Image');

const router = express.Router();


router.get('/', (req, res) => {
    res.render('add', {});
});

router.post('/', (req, res) => {
    const result = handlePlatform(req.body);
    const newGame = new Game({
        name: req.body.name,
        year: req.body.year,
        platform: result,
        website: req.body.website
    });
    console.log('newGame', newGame);

    newGame.save((err, data) => {
        if (err){
            console.log('err', err);
        } else {
            console.log(data);
            res.redirect('/');
        }
    });
});

router.get('/img', (req, res) => {
    res.render('addImg', {});
});

router.post('/img', (req, res) => {
    const newImg = new Image({
        game: req.body.game,
        url: req.body.url
    });

    newImg.save((err, data) => {
        if (err){
            console.log('err', err);
        } else {
            console.log(data);
            res.redirect('/add/img');
        }

    });
});


module.exports = router;

function handlePlatform(query){
    const result = [];

    if (query['Nintendo Switch']){
		result.push({'Nintendo Switch': 'Nintendo Switch'});
	}
	if (query['Xbox']){
		result.push({'Xbox': 'Xbox'});
	}
	if (query['PC']){
		result.push({'PC': 'PC'});
	}
	if (query['PS']){
		result.push({'PS': 'PS'});
	}
	if (query.Other){
		result.push({'Other': query.Other});
	}
    return result;

}


*/

