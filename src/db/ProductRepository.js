const pg = require("pg");
const config = require("./config");

class ProductRepository {
    constructor() {
        this.pool = new pg.Pool(config);
    }

    async query(query) {
        return this.pool.query(query);
    }

    async insert(product) {
        const keys = Object.keys(product).join(", ");
        const values = Object.values(product);
        const params = values.map((v, i) => `$${i + 1}`).join(", ");

        const query = {
            text: `INSERT INTO product(${keys}) VALUES(${params})`,
            values: values
        };

        return this.pool.query(query);
    }
    
    async update(product_id, new_entries) {
        const pairs = Object.keys(new_entries).map((v, i) => `${v} = $${i + 1}`).join(", ");
        const values = Object.values(new_entries);

        const query = {
            text: `UPDATE product SET ${pairs} WHERE id = $${values.length + 1}`,
            values: [...values, product_id]
        };

        return this.pool.query(query);
    }
    
    async delete(product_id) {
        const query = {
            text: `DELETE FROM product WHERE id = $1`,
            values: [product_id]
        };
    
        return this.pool.query(query);
    }

    async getProducts(limit = -1, page = 0) {
        let offset = limit * page;

        if (limit < 0) {
            limit = 'ALL';
            offset = 0;
        }

        const query = {
            text: `SELECT *
            FROM product
            ORDER BY id
            LIMIT ${limit} OFFSET $1`,
            values: [offset]
        };

        return this.pool.query(query);
    }

    async close() {
        await this.pool.end();
    }
}

module.exports = ProductRepository;