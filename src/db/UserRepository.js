const pg = require("pg");
const config = require("./config");
const bcrypt = require("bcrypt");

class UserRepository {
    constructor() {
        this.pool = new pg.Pool(config);
    }

    async query(query) {
        return this.pool.query(query);
    }

    async retrieve(id = null) {
        const query = {
            text: `SELECT * FROM "user" WHERE id = $1`,
            values: [id],
        };
        
        const result = await this.pool.query(query);
        return result.rows;
    }

    async insert(user) {
        const keys = Object.keys(user).join(", ");
        const values = Object.values(user);
        const params = values.map((v, i) => `$${i + 1}`).join(", ");

        const query = {
            text: `INSERT INTO "user"(${keys}) VALUES(${params})`,
            values: values
        };

        return this.pool.query(query);
    }
    
    async update(user_id, new_entries) {
        const pairs = Object.keys(new_entries).map((v, i) => `${v} = $${i + 1}`).join(", ");
        const values = Object.values(new_entries);

        const query = {
            text: `UPDATE "user" SET ${pairs} WHERE id = $${values.length + 1}`,
            values: [...values, user_id]
        };

        return this.pool.query(query);
    }
    
    async delete(user_id) {
        const query = {
            text: `DELETE FROM "user" WHERE id = $1`,
            values: [user_id]
        };
    
        return this.pool.query(query);
    }

    async register(name, email, password) {
        const salt_rounds = 10;
        const hash = await bcrypt.hash(password, salt_rounds);
        const client = await this.pool.connect();

        try {
            await client.query("BEGIN");
            
            const userQuery = {
                text: `INSERT INTO "user"(name, email, balance) VALUES($1, $2, 0) RETURNING id`,
                values: [name, email]
            };

            const userResult = await client.query(userQuery);
            const newUserId = userResult.rows[0].id;

            const hashQuery = {
                text: "INSERT INTO hash(user_id, hash) VALUES($1, $2)",
                values: [newUserId, hash],
            };

            await client.query(hashQuery);
            
            await client.query("COMMIT");
        } catch (err) {
            await client.query("ROLLBACK");
            throw err;
        } finally {
            client.release();
        }
    }

    async verifyPassword(user_email, password) {
        const selectUserResult = await this.pool.query({
            text: `SELECT id FROM "user" WHERE email = $1`,
            values: [user_email]
        });
        const user_id = selectUserResult.rows[0].id;

        const selectHashResult = await this.pool.query({
            text: "SELECT * FROM hash WHERE user_id = $1",
            values: [user_id]
        });
        const hash = selectHashResult.rows[0].hash;

        return bcrypt.compare(password, hash);
    }

    async close() {
        this.pool.end();
    }
}

module.exports = UserRepository;