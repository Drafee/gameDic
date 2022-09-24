
const mongoose = require('mongoose'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    User = mongoose.model('User');

const bcrypt = require('bcrypt');
// const saltRounds = 10;

const verifyCallback = (username, password, done) => {
    User.findOne({name: username})
        .then((user) => {
            if (!user){
                return done(null, false);
            }
            bcrypt.compare(password, user.hash, (err, flag) => {
                if (flag){
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            });
        })
        .catch((err) => {
            done(err);
        });
};

const strategy = new LocalStrategy(verifyCallback);


passport.use(strategy);
passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser((userId, done) => {
    User.findById(userId)
        .then(user => {
            done(null, user);
        })
        .catch(err => done(err));
});