var http = require('http');
var express = require('express');
var cookieParser = require('cookie-parser')
const config = require('./src/db/config');
const ProductRepository = require('./src/db/ProductRepository');
const CartRepository = require('./src/db/CartRepository');
const UserRepository = require('./src/db/UserRepository');

var app = express();

const productRepo = new ProductRepository();
const cartRepo = new CartRepository();
const userRepo = new UserRepository();

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.urlencoded({extended:true}));
app.use(cookieParser('kcv,.zx,zxjsxjhmsxxjkxxkjl'));
app.use(get_user_from_cookie)

function login_user(res, id){
    res.cookie("user_id", id, {signed: true});
}
function logout_user(res){
    res.clearCookie("user_id");
}

async function get_user_from_cookie(req, res, next){
    try {
        req.user = await userRepo.getUser(req.signedCookies.user_id);
    }
    catch(err){
        req.user = null;
    }
    next();
}


app.get('/', async (req, res) => {
    const products = (await productRepo.getProducts()).rows;
    res.render('index', {user: req.user, products: products});
});

app.post('/add_to_cart', async (req, res) => {
    try {
        await cartRepo.addToCart({
            user_id: req.user.id,
            product_id: req.body.product_id,
            quantity: req.body.quantity
        });
    } catch (err) {
        console.error(err);
    }

    res.redirect('/');
});

app.get('/shopping_cart', async (req, res) => {
    if (!req.user) res.render('cart_sorry', {user: req.user});
    const cartEntries = (await cartRepo.getCart(req.user)).rows;
    res.render('shopping_cart', {user: req.user, cartEntries: cartEntries});
});

app.post('/delete_item', async (req, res) => {
    await cartRepo.removeCartEntry(req.body.entry_id, req.user);
    res.redirect('shopping_cart');
});

app.post('/submit_cart', async (req, res) => {
    try {
        await cartRepo.orderCart(req.user);
        res.redirect('thankyou');
    } catch (err) {
        console.error(err);
        res.redirect('shopping_cart');
    }
});

app.get('/thankyou', (req, res) => {
    res.render('thankyou', {user: req.user});
});


app.get( '/login_page', (req, res) => {
    res.render('login_page', {user: req.user});
});

app.post('/login_page', async (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    try{
       let logged = await userRepo.verifyPassword(email, password);
       if (logged) {
        login_user(res, await userRepo.getId(email));
        res.redirect('/');
       }
       else {
        console.log('false')
        throw new Error('Wrong email or password');
       }
    }
    catch(err){
        console.log('error')
        res.render('login_page', {errorMessage: err, user: req.user});
    }
});

app.get('/create_account', (req, res) => {
    res.render('create_account', {user: req.user});
});

app.post('/create_account', async (req, res) => {
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    try {
        if (!email.includes('@')) {
            throw new Error('This is not an email. Please try again');
        }
        await userRepo.register(name, email, password);
        login_user(res, await userRepo.getId(email));
        res.redirect('/');
    }
    catch(err){
        console.log(err)
        res.render('create_account', {errorMessage: err, user: null});
    }    
});

app.post('/log_out', async (req, res) => {
    logout_user(res);
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


app.get('/add_product', (req, res) => {
    res.render('add_product');
});

app.post('/add_product', async (req, res) => {
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

        res.render('add_product');
    } catch (err) {
        res.render('add_product', {errorMessage: err});
    }
});

app.get('/see_users', async (req, res) => {
    const users = (await userRepo.getAllUsers()).rows;
    res.render('see_users', {users: users});
});

app.get('/see_products', async (req, res) => {
    const products = (await productRepo.getProducts()).rows;
    res.render('see_products', {products: products});
});

app.use((req,res,next) => {
    res.render('404.ejs', { url : req.url, user: req.user });
});


http.createServer(app).listen(3000);