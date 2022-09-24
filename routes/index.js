const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const passport = require('passport');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const servererror = '<h6>Something wrong with the server 😭<h6><br>Click <a href="/">HERE</a>&nbsp to get back to the home page';
const databaseErr = '<h3> Something wrong with the database<br>Click <a href="/personal-page">HERE</a>&nbsp to get back to the personal page';


router.get('/', (req, res) => {
  if (req.isAuthenticated()){
      res.redirect('/personal-page');
  } else{
    res.render('index', {});
  }
});

router.get('/login', (req,res) => {
  if (req.isAuthenticated()){
    res.redirect('/menu');
  } else{
    res.render('login', {});
  }
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

router.get('/register', (req,res) => {
  if (req.isAuthenticated()){
    res.redirect('/menu');
  } else{
    res.render('register', {});
  }
});

router.post('/register', async(req,res) => {
  try{
    const result = await User.find({name: req.body.username}).exec();
    if (result.length !== 0) {
      const err1 = 'Username has already exists. Please try another';
      res.render('register', {err1: err1});
    } else if (req.body.password !== req.body.password2){
      const err2= 'Two passwords are not the same!';
      res.render('register', {err2: err2});
    } else{
      const {username, password} = req.body;
      bcrypt.hash(password, saltRounds, function(err, hash) {
        if (err){
          res.send(err + '');
        } else{
          const newUser = new User({
            name: username,
            hash: hash,
            lovegame: [],
            reviews: [],
            state: 'on'
          });
          newUser.save((err, saveUser) => {
            if (err){
              res.status(500).send(databaseErr);
            }
            res.redirect('/login');
          });
        }});
    }

  } catch(e){
    res.status(500).send(servererror);
  }

});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', function(err, user, info){
    if (err){
      return next(err);
    } if (!user){
      return res.render('login', {err2: 'Login failed'});
    }
    req.login(user, function(err){
      if (err){
        return next(err);
      }
      return res.redirect('/personal-page');
    });

  })(req, res, next);

});


module.exports = router;
