const pg = require("pg");
const config = require("./config");

class OrderRepository {
    constructor() {
        this.pool = new pg.Pool(config);
    }

    async query(query) {
        return this.pool.query(query);
    }

    async retrieve(id = null) {
        const query = {
            text: `SELECT * FROM "order" WHERE id = $1`,
            values: [id],
        };
        
        return this.pool.query(query);
    }

    async insert(order) {
        const keys = Object.keys(order).join(", ");
        const values = Object.values(order);
        const params = values.map((v, i) => `$${i + 1}`).join(", ");

        const query = {
            text: `INSERT INTO "order"(${keys}) VALUES(${params})`,
            values: values
        };

        return this.pool.query(query);
    }
    
    async update(order_id, new_entries) {
        const pairs = Object.keys(new_entries).map((v, i) => `${v} = $${i + 1}`).join(", ");
        const values = Object.values(new_entries);

        const query = {
            text: `UPDATE "order" SET ${pairs} WHERE id = $${values.length + 1}`,
            values: [...values, order_id]
        };

        return this.pool.query(query);
    }
    
    async delete(order_id) {
        const query = {
            text: `DELETE FROM "order" WHERE id = $1`,
            values: [order_id]
        };
    
        return this.pool.query(query);
    }

    async orderSingle(product_id, buyer_id, quantity) {
        const query = {
            text: `INSERT INTO "order"(product_id, buyer_id, quantity) VALUES($1, $2, $3)`,
            values: [product_id, buyer_id, quantity]
        };

        this.pool.query(query);
    }
    
    async markAsCompleted(order_id, successful) {
        const query = {
            text: `UPDATE "order" SET completed = true, successful = $2 WHERE id = $1`,
            values: [order_id, successful]
        };
    
        this.pool.query(query);
    }

    async getAllOrders() {
        const query = {
            text: `SELECT * FROM "order"`,
            params: []
        };

        return this.pool.query(query);
    }

    async close() {
        this.pool.end();
    }
}

module.exports = OrderRepository;