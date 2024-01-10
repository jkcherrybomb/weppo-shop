const pg = require("pg");
const ProductRepository = require("./db/ProductRepository");
const UserRepository = require("./db/UserRepository");

async function testProductSelect() {
    const repo = new ProductRepository();

    try {
        const result = await repo.query("SELECT * FROM product");
        
        console.table(result);
    } catch (err) {
        console.error(err);
    }

    await repo.close();
}

async function testProductSelectExactName(name) {
    const repo = new ProductRepository();

    try {
        const result = await repo.retrieve(name ?? "Betoniarka");
        
        result.forEach(r => {
            console.log(`${r.id} | ${r.name} | ${r.price} zł | ${r.description} | ${r.quantity}`);
        });
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

    await userRepo.close();
}

async function testUserLogIn() {
    const userRepo = new UserRepository();

    console.assert(true == await userRepo.verifyPassword("me@the.com", "epicpassword420"));
    console.assert(false == await userRepo.verifyPassword("me@the.com", "wrongpassword"));
    console.assert(true == await userRepo.verifyPassword("email@www.pl", "12345678"));
    console.assert(false == await userRepo.verifyPassword("email@www.pl", "12345679"));

    await userRepo.close();
}

(async function main() {
    await testProductSelectExactName();
    await testProductSelect();
    await testProductSelectExactName("Kremówka");
    // await testUserRegister();
    await testUserLogIn();
})();