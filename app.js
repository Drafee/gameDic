// some required 
require('./db');
// require('./addGame.js');
require('./auth');

// neccesary packages
const express = require('express');
const passport = require('passport');
const path = require('path');
const session = require('express-session');
const hbs = require('express-handlebars');

// build the app
const app = express();
// const fileUpload = require('express-fileupload');

// Don't forget this line!
// const todayRandomNum = {};
// todayRandomNum.date = new Date().getDate() + '' + new Date().getMonth() + '' + new Date().getFullYear();
// todayRandomNum.num = 
// function generateRandomNum(){
//   if (todayRandomNum.new Date.getDate()){

//   }
// }
// view engine setup
// app.use(fileUpload()); 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', hbs.engine({
  extname: 'hbs',
  defaultLayout: 'layout',
  layoutsDir: path.join(__dirname, 'views')
}));

//app.use(flash);
// enable sessions
const sessionOptions = {
  secret: 'secret cookie thang(store this elsewhere!)',
  resave: true,
  saveUninitialized: true
};
app.use(express.json());
app.use(session(sessionOptions));
app.use(express.static(path.join(__dirname, '')));

// enable req.body
app.use(express.urlencoded({extended: false}));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  if (req.session.user){
    res.locals.user = req.session.user;
  }
  next();
});

// hbs.registerPartials("thePartial", __dirname + '/views/loginLayout');

const routes = require('./routes/index.js');
const personal = require('./routes/personal.js');
const gamedic = require('./routes/gamedic.js');
const gameTrvia = require('./routes/gameTrivia.js');
// const addGame = require('./routes/add.js');
const game = require('./routes/game.js');


app.use('/', routes);
// app.use('/add', addGame);
app.use('/personal-page', personal);
app.use('/gamedic', gamedic);
app.use('/gameTrivia', gameTrvia);
app.use('/', game);


app.listen(process.env.PORT || 3002);

// partials: https://handlebarsjs.com/guide/partials.html#basic-partials
// herokus: https://devcenter.heroku.com/articles/deploying-nodejs#provision-a-database
// mongodb atlas: https://www.youtube.com/watch?v=OuCrHynro0w
// bcrypt: https://www.npmjs.com/package/bcrypt
// passport: https://www.passportjs.org/concepts/authentication/middleware/
// passport video: https://www.youtube.com/watch?v=F-sFp_AvHc8
// font: https://www.1001fonts.com/video-game-fonts.html?page=5


// "db.mycoll.aggregate([{ $sample: { size: 1 } }])"