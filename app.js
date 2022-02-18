require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');

const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SECRET_STRING,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect('mongodb://localhost:27017/userDB');

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model('User', userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/', (request, response) => {
    response.redirect('/home');
});

app.get('/home', (request, response) => {
    response.render('home');
});

app.get('/login', (request, response) => {
    response.render('login');
});

app.get('/register', (request, response) => {
    response.render('register');
});

app.get('/secrets', (request, response) => {
    if (request.isAuthenticated()) {
        response.render('secrets');
    } else {
        response.redirect('/login');
    }
});

app.get('/logout', (request, response) => {
    request.logout();
    response.redirect('/home');
});

app.post('/register', (request, response) => {
    User.register({ username: request.body.username }, request.body.password, (error, registeredUser) => {
        if (error) {
            console.log(error);
            response.redirect('/');
        } else {
            passport.authenticate('local')(request, response, () => {
                response.redirect('/secrets');
            });
        }
    });
});

app.post('/login', (request, response) => {
    const user = new User({
        username: request.body.username,
        password: request.body.password
    });

    request.login(user, (error) => {
        if (error) {
            console.log(error);
        } else {
            passport.authenticate('local')(request, response, () => {
                response.redirect('/secrets');
            });
        }
    })
});

app.listen(3000, () => {
    console.log('✔ Server is running on port 3000');
});