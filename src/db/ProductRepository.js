const pg = require("pg");
const config = require("./config");

class ProductRepository {
    constructor() {
        this.pool = new pg.Pool(config);
    }

    async query(query) {
        try {
            const result = await this.pool.query(query);
            return result.rows;
        } catch (err) {
            console.error(err);
        }
    }

    async retrieve(name = null) {
        const query = {
            text: "SELECT * FROM product WHERE name = $1",
            values: [name],
        };
        
        try {
            const result = await this.pool.query(query);
            return result.rows;
        } catch (err) {
            console.error(err);
        }
    }

    async insert(product) {
        const keys = Object.keys(product).join(", ");
        const values = Object.values(product);
        const params = values.map((v, i) => `$${i + 1}`).join(", ");

        const query = {
            text: `INSERT INTO product(${keys}) VALUES(${params})`,
            values: values
        };

        try {
            const result = await this.pool.query(query);
            return result;
        } catch (err) {
            console.error(err);
        }
    }
    
    async close() {
        await this.pool.end();
    }
}

module.exports = ProductRepository;