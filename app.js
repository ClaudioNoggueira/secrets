require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');

const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/userDB');

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const User = new mongoose.model('User', userSchema);

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

app.post('/register', (request, response) => {
    bcrypt.hash(request.body.password, saltRounds, (error, hash) => {
        if (!error) {
            const newUser = new User({
                email: request.body.username,
                password: hash
            });

            newUser.save((error) => {
                if (error) {
                    console.log(error);
                } else {
                    response.render('secrets');
                }
            });
        } else {
            console.log(error);
        }
    });
});

app.post('/login', (request, response) => {
    const username = request.body.username;
    const password = request.body.password;

    User.findOne({ email: username }, (error, queryResult) => {
        if (error) {
            console.log(error);
        } else {
            if (queryResult) {
                bcrypt.compare(password, queryResult.password, (error, bcryptQueryResult) => {
                    if (!error) {
                        if (bcryptQueryResult) {
                            response.render('secrets');
                        }
                    } else {
                        console.log(error);
                    }
                });
            }
        }
    });
});

app.listen(3000, () => {
    console.log('✔ Server is running on port 3000');
});
