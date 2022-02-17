const bodyParser = require('body-parser');
const express = require('express');
const encrypt = require('mongoose-encryption');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/userDB');

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(encrypt, { secret: process.env.SECRET_STRING, encryptedFields: ['password'] });

const User = new mongoose.model('User', userSchema);

app.get('/', (request, response) => {
    response.redirect('/home');
});

app.get('/home', (request, response) => {
    response.render('home');
});

app.get('/login', (request, response) => {
    response.render('login');
})

app.get('/register', (request, response) => {
    response.render('register');
})

app.post('/register', (request, response) => {
    const newUser = new User({
        email: request.body.username,
        password: request.body.password
    });

    newUser.save((error) => {
        if (error) {
            console.log(error);
        } else {
            response.render('secrets');
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
                if (queryResult.password === password) {
                    response.render('secrets');
                }
            }
        }
    });
});

app.listen(3000, () => {
    console.log('✔ Server is running on port 3000');
});
