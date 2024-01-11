var http = require('http');
var express = require('express');
var app = express();

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (req, res) => {
    res.render('index', {firstName: "Julia", lastName: "Konefal"});
});

app.get('/shopping_cart', (req, res) => {
    res.render('shopping_cart');
});

app.get('/admin_page', (req, res) => {
    res.render('admin_page');
});

app.get('/login_page', (req, res) => {
    res.render('login_page');
});

app.get('/search', (req, res) => {
    res.render('search');
});

let username = "Julka";

http.createServer(app).listen(3000);
