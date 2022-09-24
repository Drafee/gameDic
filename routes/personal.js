const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Game = mongoose.model('Game');
const noUserMessage = '<h3>Sorry no user has login<h3><br>Click <a href="/">HERE</a>&nbsp to get back to the home page';
const databaseErr = '<h6>Something wrong with the databse. Maybe try again later. <h6><br>Click <a href="/">HERE</a>&nbsp to get back to the home page';

router.get('/', async(req, res) => {
	if (req.isAuthenticated()) {
		Game.find({}, (err, games) => {
			if (err){
				res.status(500).send(databaseErr);
			} else {
				const numbers = games.length;
				const game = games[Math.floor(Math.random() * numbers)];
				res.render('personal-page', {game: game, name: req.user.name});
			}
		}).lean();
	} else{
		res.send(noUserMessage);
	}
});



router.get('/favorates', (req, res) => {
	if (req.isAuthenticated()) {
		res.json(req.user.loveGame);
	} else{
		res.send(noUserMessage);
	}
});

router.get('/reviews', (req, res) => {
	if (req.isAuthenticated()) {
		res.json(req.user.Review);
	} else{
		res.send(noUserMessage);
	}
});

module.exports = router;