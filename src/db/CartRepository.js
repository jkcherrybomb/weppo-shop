const pg = require("pg");
const config = require("./config");
const OrderRepository = require("./OrderRepository");

class CartRepository {
    constructor() {
        this.pool = new pg.Pool(config);
    }

    async query(query) {
        return this.pool.query(query);
    }

    async getCart(user_info) {
        const cartQuery = {
            text: `SELECT cart_entry.id AS entry_id, user_id, product.id AS product_id, product.name, product.price, product.description, product.quantity AS available, cart_entry.quantity AS desired
            FROM cart_entry
                JOIN product ON cart_entry.product_id = product.id
            WHERE cart_entry.user_id = $1`
        };

        if ("id" in user_info) {
            cartQuery.values = [user_info["id"]];
        } else if ("email" in user_info) {
            const userQuery = {
                text: `SELECT id
                FROM "user"
                WHERE email = $1`,
                values: [user_info["email"]]
            };

            const result = await this.pool.query(userQuery);
            cartQuery.values = [result.rows[0].id];
        } else {
            throw new Error("No user info supplied.");
        }

        return this.pool.query(cartQuery);
    }

    async addToCart(entry_info) {
        const insertQuery = {
            text: `INSERT INTO cart_entry(user_id, product_id, quantity)
            VALUES($1, $2, $3)`,
            values: [entry_info.user_id, entry_info.product_id, entry_info.quantity]
        };
        return this.pool.query(insertQuery);
    }

    async removeCartEntry(entry_id, user_info) {
        let user_id;

        if (user_info.id) {
            user_id = user_info["id"];
        } else if (user_info.email) {
            const userQuery = {
                text: `SELECT id
                FROM "user"
                WHERE email = $1`,
                values: [user_info["email"]]
            };

            const result = await this.pool.query(userQuery);
            user_id = result.rows[0].id;
        } else {
            throw new Error("No user info supplied.");
        }

        const deleteQuery = {
            text: `DELETE FROM cart_entry WHERE id = $1 AND user_id = $2`,
            values: [entry_id, user_id]
        };

        return this.pool.query(deleteQuery);
    }

    async clearCart(user_info) {
        const cartQuery = {
            text: `DELETE FROM cart_entry
            WHERE cart_entry.user_id = $1`
        };

        if ("id" in user_info) {
            cartQuery.values = [user_info["id"]];
        } else if ("email" in user_info) {
            const userQuery = {
                text: `SELECT id
                FROM "user"
                WHERE email = $1`,
                values: [user_info["email"]]
            };

            const result = await this.pool.query(userQuery);
            cartQuery.values = [result.rows[0].id];
        } else {
            throw new Error("No user info supplied.");
        }

        return this.pool.query(cartQuery);
    }

    async orderCart(user_info) {
        const client = await this.pool.connect();
        const orderRepo = new OrderRepository();

        try {
            await client.query("BEGIN");

            const cart = (await this.getCart(user_info)).rows;
            for (const cart_entry of cart) {
                if (cart_entry.desired > cart_entry.available) {
                    throw {
                        what: "The desired quantity exceeds the available quantity.",
                        product_name: cart_entry.name,
                        desired: cart_entry.desired,
                        available: cart_entry.available
                    };
                } else {
                    const insertQuery = {
                        text: `INSERT INTO "order"(product_id, buyer_id, quantity) VALUES($1, $2, $3)`,
                        values: [cart_entry.product_id, cart_entry.user_id, cart_entry.desired]
                    };

                    await client.query(insertQuery);
                }
            }

            this.clearCart(user_info);

            await client.query("COMMIT");
        } catch (err) {
            await client.query("ROLLBACK");
            throw err;
        } finally {
            client.release();
            orderRepo.close();
        }
    }

    async close() {
        await this.pool.end();
    }
}

module.exports = CartRepository;