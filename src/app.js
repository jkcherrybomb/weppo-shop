const pg = require("pg");
const ProductRepository = require("./db/ProductRepository");

(async function main() {
    const repo = new ProductRepository();

    try {
        const result = await repo.query("SELECT * FROM product");
        
        console.table(result);
    } catch (err) {
        console.error(err);
    }

    // try {
    //     const result = await repo.retrieve("Betoniarka");
        
    //     result.forEach(r => {
    //         console.log(`${r.id} | ${r.name} | ${r.price} zł | ${r.description} | ${r.quantity}`);
    //     });
    // } catch (err) {
    //     console.error(err);
    // }

    // try {
    //     const result = await repo.insert({
    //         name: "Kremówka",
    //         price: 21.37,
    //         description: "xd",
    //         quantity: 2137
    //     });

    //     console.log(result);
    // } catch (err) {
    //     console.error(err);
    // }

    // try {
    //     const result = await repo.update(2, {
    //         price: 213.70,
    //         description: "xD",
    //     });

    //     console.log(result);
    // } catch (err) {
    //     console.error(err);
    // }

    // try {
    //     const result = await repo.delete(3);

    //     console.log(result);
    // } catch (err) {
    //     console.error(err);
    // }
    
    await repo.close();
})();