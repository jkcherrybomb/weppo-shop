const pg = require("pg");
const ProductRepository = require("./db/ProductRepository");
const UserRepository = require("./db/UserRepository");
const OrderRepository = require("./db/OrderRepository");
const CartRepository = require("./db/CartRepository");

async function testProductSelect() {
    const repo = new ProductRepository();

    try {
        const result = await repo.query("SELECT * FROM product");
        const rows = result.rows;
        console.table(rows);
    } catch (err) {
        console.error(err);
    }

    await repo.close();
}

async function testProductInsert() {
    const repo = new ProductRepository();

    try {
        const result = await repo.insert({
            name: "Kremówka",
            price: 21.37,
            description: "xd",
            quantity: 2137
        });

        console.log(result);
    } catch (err) {
        console.error(err);
    }
    
    await repo.close();
}

async function testProductUpdate() {
    const repo = new ProductRepository();

    try {
        const result = await repo.update(2, {
            price: 213.70,
            description: "xD",
        });

        console.log(result);
    } catch (err) {
        console.error(err);
    }    

    await repo.close();
}

async function testProductDelete() {
    const repo = new ProductRepository();

    try {
        const result = await repo.delete(3);

        console.log(result);
    } catch (err) {
        console.error(err);
    }

    await repo.close();
}

async function testUserRegister() {
    const userRepo = new UserRepository();

    // await userRepo.register("user123", "me@the.com", "epicpassword420");
    // await userRepo.register("user456", "email@www.pl", "12345678");
    
    try {
        await userRepo.register("disallowed", "email@www.pl", "12345678");
        console.assert(true == false);
    } catch (err) {
        // ok
    }

    await userRepo.close();
}

async function testUserLogIn() {
    const userRepo = new UserRepository();

    console.assert(true == await userRepo.verifyPassword("me@the.com", "epicpassword420"));
    console.assert(false == await userRepo.verifyPassword("me@the.com", "wrongpassword"));
    console.assert(true == await userRepo.verifyPassword("email@www.pl", "12345678"));
    console.assert(false == await userRepo.verifyPassword("email@www.pl", "12345679"));

    try {
        await userRepo.verifyPassword("doesnotexist@at.all", "8786edFHGJU8");
        console.assert(true == false);
    } catch (err) {
        // ok
    }

    await userRepo.close();
}

async function testUserRoleCheck() {
    const userRepo = new UserRepository();

    console.assert(true == await userRepo.isUserinRole(29, "admin"));
    console.assert(false == await userRepo.isUserinRole(1, "admin"));
    
    console.assert(true == await userRepo.isUserinAnyRoles(29, ["admin", "foo"]));
    console.assert(false == await userRepo.isUserinAnyRoles(29, ["foo", "bar"]));
    console.assert(false == await userRepo.isUserinAnyRoles(1, ["foo", "bar"]));

    await userRepo.close();
}

async function testOrderComplete() {
    const orderRepo = new OrderRepository();

    orderRepo.markAsCompleted(2, true);

    orderRepo.close();
}

async function testGetAllUsers() {
    const userRepo = new UserRepository();

    const result = await userRepo.getAllUsers();
    console.table(result.rows);

    userRepo.close();
}

async function testGetAllProducts() {
    const productRepo = new ProductRepository();

    const result = await productRepo.getProducts();
    console.table(result.rows);

    productRepo.close();
}

async function testGetSomeProducts(limit, page) {
    const productRepo = new ProductRepository();

    const result = await productRepo.getProducts("", limit, page);
    console.table(result.rows);

    productRepo.close();
}

async function testGetAllOrders() {
    const orderRepo = new OrderRepository();

    const result = await orderRepo.getAllOrders();
    console.table(result.rows);

    orderRepo.close();
}

async function testGetCart(user_info) {
    const cartRepo = new CartRepository();

    const result = await cartRepo.getCart(user_info);
    console.table(result.rows);

    cartRepo.close();
}

async function testClearCart(user_info) {
    const cartRepo = new CartRepository();

    const result = await cartRepo.clearCart(user_info);
    console.log(result);

    cartRepo.close();
}

async function testOrderCart(user_info) {
    const cartRepo = new CartRepository();

    const result = await cartRepo.orderCart(user_info);
    console.log(result);

    cartRepo.close();
}

async function testAddRole() {
    const userRepo = new UserRepository();

    const result = await userRepo.addRole("Spectator");
    console.log(result);

    userRepo.close();
}

async function testRemoveRole() {
    const userRepo = new UserRepository();

    const result = await userRepo.removeRole("Spectator");
    console.log(result);

    userRepo.close();
}

async function testAddRoleToUser() {
    const userRepo = new UserRepository();

    const result = await userRepo.addRoleToUser("Spectator", 29);
    console.log(result);

    userRepo.close();
}

async function testRemoveRoleFromUser() {
    const userRepo = new UserRepository();

    const result = await userRepo.removeRoleFromUser("admin", 29);
    console.log(result);

    userRepo.close();
}

async function testGetUserRoles() {
    const userRepo = new UserRepository();

    const result = await userRepo.getUserRoles(29);
    console.log(result);

    userRepo.close();
}

(async function main() {
    // await testProductSelect();
    // await testUserRegister();
    // await testUserLogIn();
    // await testUserRoleCheck();
    // await testOrderComplete();
    // await testGetAllUsers();
    // await testGetAllProducts();
    // await testGetSomeProducts(2);
    // await testGetSomeProducts(2, 0);
    // await testGetSomeProducts(2, 1);
    // await testGetSomeProducts(2, 2);
    // await testGetSomeProducts(3);
    // await testGetSomeProducts(3, 1);
    // await testGetSomeProducts(3, 2);
    // await testGetAllOrders();
    // await testGetCart({id: 1});
    // await testGetCart({email: "arc@shop.com"});
    // await testClearCart({id: 1});
    // await testOrderCart({id: 1});
    // await testAddRole();
    // await testRemoveRole();
    // await testAddRoleToUser();
    // await testRemoveRoleFromUser();
    // await testGetUserRoles();
})();
