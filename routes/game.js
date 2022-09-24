const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Game = mongoose.model('Game');
const Image = mongoose.model('Image');
const noUserMessage = '<h3>Sorry no user has login<h3><br>Click <a href="/">HERE</a>&nbsp to get back to the main page';
const databaseErr = '<h3> Something wrong with the database<br>Click <a href="/personal-page">HERE</a>&nbsp to get back to the personal page';
const Review = mongoose.model('Review');
const User = mongoose.model('User');

router.get('/:gamename', (req, res) => {
    if (req.isAuthenticated()){
        try{
            Game.findOne({name: req.params.gamename}, (err, game) => {
                if (err){
                    res.status(500).send(databaseErr);
                } else if (game){
                    const thatGame = {name: game.name,
                        year: game.year,
                        platform: dealPlatform(game.platform),
                        website: game.website,
                        reviews: game.reviews};
                    Image.findOne({game: req.params.gamename}, (err, img) => {
                        if (err){
                            res.status(500).send(databaseErr);
                        } else {
                            res.render('game', {game: thatGame, img:img});
                        }
                    }).lean();
                }
                else {
                    res.status(500).send(databaseErr);
                }
            }).lean();
        }catch(e){
            res.status(404).send('<h2>Nothing Here<h2><br>Click <a href="/">HERE</a>&nbsp to get back to the main page');
        }

      } else{
        res.send(noUserMessage);
      }
});

router.post('/:gamename', (req, res) => {
    const {content} = req.body;
    const newReview = new Review({
        user: req.user.name,
        game: req.params.gamename,
        date: new Date(),
        contents: content
    });
    newReview.save((err, data) => {
        if (err){
            res.status(500).send(databaseErr);
        } else {
            User.findOneAndUpdate({name: data.user}, {$push: {Review: data}}, (err, doc) => {
                if (err){
                    res.status(500).send(databaseErr);
                } else {
                    console.log(doc);
                }
            });
            Game.findOneAndUpdate({name: data.game}, {$push: {reviews: data}}, (err, doc) => {
                if (err){
                    res.status(500).send(databaseErr);
                } else {
                    console.log(doc);
                }
            });
        }
        res.json(data);
    });
});

router.get('/:gamename/love', (req, res) => {
    if (req.isAuthenticated){
        res.json(req.user.loveGame.map(i => i.name).includes(req.params.gamename));
    } else{
        res.redirect('/');
    }
});

router.post('/:gamename/love', (req, res) => {
    if (req.isAuthenticated){
        console.log(req.body.msg);
        if (req.body.msg === 'add'){
            Game.findOne({name: req.params.gamename}, (err, game) => {
                if (err){
                    res.status(500).send(databaseErr);
                } else {
                    User.findOneAndUpdate({name: req.user.name}, {$push: {loveGame: game}}, (err, doc) => {
                        if (err){
                            res.status(500).send(databaseErr);
                        } else {
                            // console.log(doc);
                            res.json('good');
                        }
                    });
                }
            });
        } else{
            Game.findOne({name: req.params.gamename}, (err, game) => {
                console.log(req.body.msg);
                if (err){
                    res.status(500).send(databaseErr);
                } else {
                    User.findOneAndUpdate({name: req.user.name}, {$pull: {loveGame: game}}, (err, doc) => {
                        if (err){
                            res.status(500).send(databaseErr);
                        } else {
                            // console.log(doc);
                            res.json('good');
                        }
                    });
                }
            });
        }
    } else{
        res.redirect('/');
    }
});

function dealPlatform(platform){

	const result = platform.map(item => Object.values(item)[0]);
	return result.join(', ');
}
module.exports = router;