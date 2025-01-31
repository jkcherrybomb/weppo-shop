let http = require('http');
let express = require('express');
let cookieParser = require('cookie-parser')
const config = require('./src/db/config');
const ProductRepository = require('./src/db/ProductRepository');
const CartRepository = require('./src/db/CartRepository');
const UserRepository = require('./src/db/UserRepository');
const OrderRepository = require('./src/db/OrderRepository');

let app = express();

const productRepo = new ProductRepository();
const cartRepo = new CartRepository();
const userRepo = new UserRepository();
const orderRepo = new OrderRepository();

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
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
        req.user.roles = await userRepo.getUserRoles(req.signedCookies.user_id);
    }
    catch(err){
        req.user = null;
    }
    next();
}

app.get('/', async (req, res) => {
    const substring = req.query.q ?? "";
    const products = (await productRepo.getProducts(substring)).rows;
    res.render('index', {user: req.user, products});
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
    const options = {user: req.user, cartEntries};
    if (req.query.empty != undefined && req.query.empty != null)
        options.errorMessage = "You cannot order an empty cart.";
    res.render('shopping_cart', options);
});

app.post('/delete_item', async (req, res) => {
    await cartRepo.removeCartEntry(req.body.entry_id, req.user);
    res.redirect('shopping_cart');
});

app.post('/submit_cart', async (req, res) => {
    try {
        if ((await cartRepo.getCart(req.user)).rowCount == 0) {
            res.redirect('shopping_cart?empty=1');
            return;
        }

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
    let email = req.body.email;
    let password = req.body.password;
    try{
       let logged = await userRepo.verifyPassword(email, password);
       if (logged) {
        login_user(res, await userRepo.getId(email));
        res.redirect('/');
       }
       else {
        throw new Error('Wrong email or password');
       }
    }
    catch(err){
        res.render('login_page', {errorMessage: err, user: req.user, email: email});
    }
});

app.get('/create_account', (req, res) => {
    res.render('create_account', {user: req.user});
});

app.post('/create_account', async (req, res) => {
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    try {
        if (!email.includes('@')) {
            throw new Error('This is not an email. Please try again');
        }

        if (name == "")
            throw new Error('Name must not be empty.');

        if (password == "")
            throw new Error('Password must not be empty.');

        await userRepo.register(name, email, password);
        login_user(res, await userRepo.getId(email));
        res.redirect('/');
    }
    catch(err){
        console.log(err)
        res.render('create_account', {errorMessage: err, user: null, name: name, email: email});
    }    
});

app.post('/log_out', async (req, res) => {
    logout_user(res);
    res.redirect('/');
});


app.get('/add_product', (req, res) => {
    if (!req.user) res.render('sorry_admin', {user: req.user});
    else if (req.user && !req.user.roles.includes("admin")) {
        res.render('sorry_admin', {user: req.user});
    }
    else res.render('add_product', {user: req.user});
});

app.post('/add_product', async (req, res) => {
    let name = req.body.name;
    let price = req.body.price;
    let description = req.body.description;
    let quantity = req.body.quantity;

    try {
        if (quantity < 0)
            throw new Error("Cannot add a negative amount of products.");

        await productRepo.insert({
            name: name,
            price: price,
            description: description,
            quantity: quantity
        });

        res.render('add_product', {user: req.user});
    } catch (err) {
        res.render('add_product', {user: req.user, errorMessage: err});
    }
});

app.get('/see_users', async (req, res) => {
    if (!req.user) res.render('sorry_admin', {user: req.user});
    else if (req.user && !req.user.roles.includes("admin")) {
        res.render('sorry_admin', {user: req.user});
    }
    else {
        const users = (await userRepo.getAllUsers()).rows;
        for (let u of users) {
           u.roles = await userRepo.getUserRoles(u.id);
        }
        console.log(users);
        res.render('see_users', {users});
    }
});

app.post('/delete_user', async (req, res) => {
    await userRepo.delete(req.body.user_id);
    res.redirect('see_users');
});

app.get('/see_products', async (req, res) => {
    if (!req.user) res.render('sorry_admin', {user: req.user});
    else if (req.user && !req.user.roles.includes("admin")) {
        res.render('sorry_admin', {user: req.user});
    }
    else {
    const products = (await productRepo.getProducts()).rows;
    res.render('see_products', {products: products});
    }
});

app.post('/delete_product_button', async (req, res) => {
    await productRepo.delete(req.body.product_id);
    res.redirect('see_products');
});

app.post('/edit_product_button', async (req, res) => {
    let product_id = req.body.product_id;
    res.redirect('/edit_product?product_id='+product_id);
});

app.get('/edit_product', async (req, res) => {
    if (!req.user) res.render('sorry_admin', {user: req.user});
    else if (req.user && !req.user.roles.includes("admin")) {
        res.render('sorry_admin', {user: req.user});
    }
    else {
    let product_id = req.query.product_id;
    let product = await productRepo.getProduct(product_id)
    res.render('edit_product', {product_id, product});
    }
});

app.post('/edit_product', async (req, res) => {
    let name = req.body.name;
    let price = Number(req.body.price);
    let description = req.body.description;
    let quantity = Number(req.body.quantity);
    let product_id = req.query.product_id;
    try {
        if (quantity < 0)
            throw new Error("Cannot add a negative amount of products.");
        
        await productRepo.update(product_id, {
            name: name,
            price: price,
            description: description,
            quantity: quantity
        });

        res.redirect('see_products');
    } catch (err) {
        console.log(err);
        let product = await productRepo.getProduct(product_id)
        res.render('edit_product', {product_id, product, errorMessage: err});
    }
});

app.get('/see_orders', async (req, res) => {
    if (!req.user) res.render('sorry_admin', {user: req.user});
    else if (req.user && !req.user.roles.includes("admin")) {
        res.render('sorry_admin', {user: req.user});
    }
    else {
    let all_orders = (await orderRepo.getAllOrders()).rows;
    console.log(all_orders)
    res.render('see_orders', {all_orders});
    }
});


app.use((req,res,next) => {
    res.render('404.ejs', { url : req.url, user: req.user });
});


http.createServer(app).listen(3000);