var http = require('http');
var express = require('express');
var app = express();

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.urlencoded({extended:true}));


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
    var name = req.query.name;
    var surname = req.query.surname;
    var email = req.query.email;
    var password = req.query.password;
    res.render('index', {name, surname, products: a});
});

app.get('/shopping_cart', (req, res) => {
    res.render('shopping_cart', {products: a});
});

app.get('/thankyou', (req, res) => {
    res.render('thankyou');
});


app.get('/admin_page', (req, res) => {
    res.render('admin_page');
});

app.get( '/login_page', (req, res) => {
    res.render('login_page');
});

app.post('/login_page', (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    res.redirect('/');
});


app.get('/create_account', (req, res) => {
    res.render('create_account');
});

app.post('/create_account', (req, res) => {
    var name = req.body.name;
    var surname = req.body.surname;
    var email = req.body.email;
    var password = req.body.password;
    res.redirect('/');
});

var b = [];
b[0] = {
    name: "bananas",
    price: 2.50,
    description:"bananas from brazil, price per kg",
    quantity: 45
}

app.get('/search', (req, res) => {
    res.render('search', {products: b});
});


http.createServer(app).listen(3000);
