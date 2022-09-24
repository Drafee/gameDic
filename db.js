
const mongoose = require('mongoose');


const Review = new mongoose.Schema({
  user: String,
  date: {type: Date, required: true},
  game: String,
  contents: {type: String, required: true},
  states: String
});

const Game = new mongoose.Schema({
  name: {type: String, required: true},
  year: {type: Number, required: true},
  platform: {type: Array,required: true},
  reviews: [Review],
  website: String
});

const User = new mongoose.Schema({
  name: {type: String, required: true},
  hash: {type: String, required: true},
  loveGame: [Game],
  Review: [Review],
  state: String
});

const Image = new mongoose.Schema({
  game: String,
  url: String
});

mongoose.model('User', User);
mongoose.model('Game', Game);
mongoose.model('Review', Review);
mongoose.model('Image', Image);
const password = '2001-WblSyq';
const MONGODB_URI = `mongodb+srv://Drafee:${password}@gamedic.zbmty.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
mongoose.connect(MONGODB_URI||'mongodb://localhost/gamedicdb');
