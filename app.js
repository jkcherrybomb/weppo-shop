var http = require('http');
var express = require('express');
const config = require('./src/db/config');
const ProductRepository = require('./src/db/ProductRepository');
const CartRepository = require('./src/db/CartRepository');

var app = express();

const productRepo = new ProductRepository();
const cartRepo = new CartRepository();

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.urlencoded({extended:true}));

app.get('/', async (req, res) => {
    var name = req.query.name;
    var surname = req.query.surname;

    const products = (await productRepo.getProducts()).rows;
    res.render('index', {name, surname, products: products});
});

app.post('/add_to_cart', async (req, res) => {
    try {
        await cartRepo.addToCart({
            // REPLACE
            user_id: USER_ID,
            product_id: req.body.product_id,
            quantity: req.body.quantity
        });
    } catch (err) {
        console.error(err);
    }

    res.redirect('/');
});

app.get('/shopping_cart', async (req, res) => {
    const user_info = {
        id: USER_ID,
        // OR
        email: USER_EMAIL
        // WHICHEVER ONE YOU'RE STORING ABOUT THE LOGGED-IN USER
    };
    const cartEntries = (await cartRepo.getCart(user_info)).rows;
    res.render('shopping_cart', {cartEntries: cartEntries});
});

app.post('/shopping_cart', async (req, res) => {
    const user_info = {
        id: USER_ID,
        // OR
        email: USER_EMAIL
    };
    cartRepo.removeCartEntry(req.body.entry_id, user_info);
    const cartEntries = (await cartRepo.getCart(user_info)).rows;
    res.render('shopping_cart', {cartEntries: cartEntries});
});

app.get('/submit_cart', async (req, res) => {
    try {
        // const user_info = {
        //     id: USER_ID,
        //     // OR
        //     email: USER_EMAIL
        // };
        // await cartRepo.orderCart(user_info);
        res.redirect('thankyou');
    } catch (err) {
        console.error(err);
        res.redirect('shopping_cart');
    }
});

app.get('/thankyou', (req, res) => {
    res.render('thankyou');
});


app.get('/admin_page', (req, res) => {
    res.render('admin_page');
});

app.post('/admin_page', async (req, res) => {
    var name = req.body.name;
    var price = req.body.price;
    var description = req.body.description;
    var quantity = req.body.quantity;

    try {
        await productRepo.insert({
            name: name,
            price: price,
            description: description,
            quantity: quantity
        });

        res.render('admin_page');
    } catch (err) {
        res.render('admin_page', {errorMessage: err});
    }
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