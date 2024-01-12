var http = require('http');
var express = require('express');
var app = express();

app.set('view engine', 'ejs');
app.set('views', './views');

fn = "Julia"
ln = "Konefal"
var a = [];
a[0] = {
    name: "bananas",
    price: 2.50,
    description:"bananas from brazil, price per kg",
    quantity: 45
}

a[1] = {
    name: "oreos",
    price: 5.00,
    description:"standard oreos",
    quantity: 30
}

a[2] = {
    name: "water Żywiec Zdrój",
    price: 1.23,
    description:"1l",
    quantity: 25
}
a[3] = {
    name: "orange juice Tymbark",
    price: 2.50,
    description:"1 liter",
    quantity: 5
}

app.get('/', (req, res) => {
    res.render('index', {firstName: fn, lastName: ln, products: a});
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
