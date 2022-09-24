const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const Game = mongoose.model('Game');
const Image = mongoose.model('Image');

const noUserMessage = '<h3>Sorry no user has login<h3><br>Click <a href="/">HERE</a>&nbsp to get back to the main page';


router.get('/', (req, res) => {
	if (req.isAuthenticated()) {
		res.render('gameTrivia', {});
	} else{
		res.send(noUserMessage);
	}
});


router.get('/game', (req, res) => {
	Game.find({}, (err, games) => {
		if (err){
			console.log('err', err);
		} else{
			const result = generateGame(games);
			const hint = getRandomDifficulty(result.game);
			const results = {...result, ...hint};
			Image.find({game: result.game.name}, (err, imgs) => {
				if (imgs){
					results.src = imgs[0].url;
					res.json(results);
				}
			});
		}
	});
});

module.exports = router;


function getRandomDifficulty(game){
	const order = [1, 2, 3];
	for (let i = order.length - 1; i > 0; i--){
		const j = Math.floor(Math.random() * (i + 1));
		[order[i], order[j]] = [order[j], order[i]];
	}
	let [yearHint, platformHint, imgHint] = [...order];
	yearHint = handleYearHint(yearHint, game.year);
	platformHint = handlePlatformHint(platformHint, game.platform);
	return {yearHint, platformHint, imgHint};
}

function handleYearHint(yearHint, year){
	// year + 0 means is not issued on the years
	// year + 1 means it is issue on the years
	// year + 2 means it is issued after the year
	// year + 3 means it is issue before the year
	// year + 4 means it is issue on the year
	let output = '';
	const outputArr = [];
	if (yearHint === 1){
		for (let i = 1950; i <= 2020; i = i + 10){
			if (Math.floor(year/10) * 10 !== i){
				outputArr.push(i * 10);
			}
			if (Math.floor(year/10) - i >= 2){
				outputArr.push(i * 10 + 2);
			}
			if (Math.floor(year/10) - i <= -2){
				outputArr.push(i * 10 + 3);
			}
		}

	} else if(yearHint === 2){
		for (let i = 1950; i <= 2020; i = i + 10){
			if (Math.floor(year/10) * 10 === i){
				outputArr.push(i * 10 + 1);
			} else if (Math.floor(year/10) - i <= 3 && Math.floor(year/10) - i > 0){
				outputArr.push(i * 10 + 2);
			} else if (Math.floor(year/10) - i >= -3 && Math.floor(year/10) - i < 0){
				outputArr.push(i * 10 + 3);
			}
		}
	} else{
		for (let i = (Math.floor(year/10) - 1) * 10; i <= 2022; i = i + 1){
			if (Math.floor(year/10) * 10 === i){
				outputArr.push(i * 10 + 1);
			}

			if (year - i <= 5 && year - i > 0){
				outputArr.push(i * 10 + 2);
			}

			if (year - i >= -5 && year - i < 0){
				outputArr.push(i * 10 + 3);
			}

			if (year - i === 0){
				outputArr.push(i * 10 + 4);
			}
		}

	}
	const check = outputArr[Math.floor(Math.random() * outputArr.length)];
	if (check % 10 === 0){
		output = 'It is not released on the '+ Math.floor(check/10)+ 's';

	} else if (check % 10 === 1){
		output = 'It is released on the '+ Math.floor(check/10)+ 's';

	} else if (check % 10 === 2){
		output = 'It is released after the year '+ Math.floor(check/10);

	} else if (check % 10 === 3){
		output = 'It is released before the year '+ Math.floor(check/10);

	} else{
		output = 'It is released on the year '+ Math.floor(check/10);
	}
	return output;
}

function handlePlatformHint(platformHint, platform){
	let output = '';
	const outputArr = [];
	const platforms = ["Nintendo Switch", "Xbox", "PS", "PC"];
	const checkOriginal = platform.map(i => Object.keys(i)[0]);

	// 0, 1, 2, 3, 4
	// 0, means it is on the platform, 1 means it is not on the platform
	for (const i in platforms){
		if (checkOriginal.includes(platforms[i])){
			outputArr.push(i * 10);
		} else{
			outputArr.push(i * 10 + 1);
		}
	}
	if (platformHint === 1){
		const check = outputArr[Math.floor(Math.random() * outputArr.length)];
		if (check % 10 === 0){
			output = '☑️' + platforms[Math.floor(check / 10)];
		} else {
			output = '❌' + platforms[Math.floor(check / 10)];
		}

	} else if(platformHint === 2){
		const check1 = outputArr[Math.floor(Math.random() * outputArr.length)];
		const check2 = outputArr[Math.floor(Math.random() * outputArr.length)];
		if (check1 % 10 === 0){
			output = '☑️' + platforms[Math.floor(check1 / 10)];
		} else {
			output = '❌' + platforms[Math.floor(check1 / 10)];
		}
		
		if (check1 !== check2){
			if (check2 % 10 === 0){
				output = '☑️' + platforms[Math.floor(check2 / 10)];
			} else {
				output += '  ❌' + platforms[Math.floor(check2 / 10)];
			}
		}

	} else {
		output = platform.map(i => '☑️' + Object.values(i)[0]).join('  ');

	}

	return output;

}

function generateGame(games){
	const result = {};
	const gamesName = games.map(i => i.name);
	result.game = games[Math.floor(Math.random() * gamesName.length)];
	result.choices = [result.game.name];
	let i = 0;
	while (i < 3){
		const current = gamesName[Math.floor(Math.random() * gamesName.length)];
		if (!result.choices.includes(current)){
			result.choices.push(current);
			i ++;
		}
	}
	return result;
}