const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv');

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

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

app.listen(3000, () => {
    console.log('✔ Server is running on port 3000');
});
