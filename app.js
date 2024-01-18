var http = require('http');
var express = require('express');
const config = require('./src/db/config');
const ProductRepository = require('./src/db/ProductRepository');

var app = express();

const productRepo = new ProductRepository();

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.urlencoded({extended:true}));

app.get('/', async (req, res) => {
    var name = req.query.name;
    var surname = req.query.surname;

    const products = (await productRepo.getProducts()).rows;
    res.render('index', {name, surname, products: products});
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

app.post('/admin_page', (req, res) => {
    var name = req.body.name;
    var price = req.body.price;
    var description = req.body.description;
    var quantity = req.body.quantity;
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
