const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Game = mongoose.model('Game');
const ns = 'Nintendo Switch';
const noUserMessage = '<h3>Sorry no user has login<h3><br>Click <a href="/">HERE</a>&nbsp to get back to the main page';
const databaseErr = '<h3> Something wrong with the database<br>Click <a href="/personal-page">HERE</a>&nbsp to get back to the personal page';

router.get('/', async(req, res) => {
	if (req.isAuthenticated()){
		try{
			const game = await Game.find({}).lean().exec();
			const games = game.map(r => {
				return {name: r.name,
				year: r.year,
				platform: dealPlatform(r.platform)};
			});
			res.render('gamedic', {game: games, count: game.length});
		} catch(e){
			res.status(500).send(databaseErr);
		}
	}else{
		res.send(noUserMessage);
	}
});

router.post('/', (req, res) => {

	if (req.isAuthenticated()){
		const selectObj = handleSearch(req.body);
		Game.find(selectObj, (err, game, count) => {
			if (err){
				res.status(500).send(databaseErr);
			} else{
				const games = game.map(r => {
					return {name: r.name,
					year: r.year,
					platform: dealPlatform(r.platform)};
				});
	
				res.render('gamedic', {game: games, count: game.length});
			}
		});
	}else{
		res.send(noUserMessage);
	}
});


module.exports = router;


function dealPlatform(platform){

	const result = platform.map(item => Object.values(item)[0]);
	return result.join(', ');
}
function handleSearch(info){
	const result = {};
	if (info['year']){
		result.year = parseInt(info['year']);
	}
	result.$or = [];
	if (info['Nintendo Switch']){
		result.$or.push(queryMaker(ns));
	}
	if (info['Xbox']){
		result.$or.push(queryMaker('Xbox'));
	}
	if (info['PC']){
		result.$or.push(queryMaker('PC'));
	}
	if (info['PS']){
		result.$or.push(queryMaker('PS'));
	}
	if (info['Other']){
		result.$or.push(queryMaker('Other'));
	}
	// console.log(info);
	if (Object.keys(result.$or).length === 0 ) {
		delete result.$or;
	}

	return result;
}

function queryMaker(name){
	const result = {};
	result.platform = {};
	result.platform.$elemMatch = {};
	result.platform.$elemMatch[name] = {"$exists": true};
	return result;
}
