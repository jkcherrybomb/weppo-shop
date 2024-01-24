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
        
        return this.pool.query(query);
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
                text: `INSERT INTO "user"(name, email) VALUES($1, $2) RETURNING id`,
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
        if (selectUserResult.rows.length == 0) {
            return false;
            //return Promise.reject(new Error(`There is no user with the specified email: '${user_email}'`));
        }
        const user_id = selectUserResult.rows[0].id;

        const selectHashResult = await this.pool.query({
            text: "SELECT * FROM hash WHERE user_id = $1",
            values: [user_id]
        });
        const hash = selectHashResult.rows[0].hash;

        return bcrypt.compare(password, hash);
    }

    async isUserinRole(user_id, role_name) {
        const result = await this.pool.query({
            text: `SELECT user_id FROM userrole
            JOIN role ON userrole.role_id = role.id
            WHERE userrole.user_id = $1 AND role.name = $2;`,
            values: [user_id, role_name]
        });

        return result.rows.length != 0;
    }

    async isUserinAnyRoles(user_id, role_names) {
        const params = role_names.map((v, i) => `$${i + 2}`).join(", ");

        const result = await this.pool.query({
            text: `SELECT * FROM userrole
            JOIN role ON userrole.role_id = role.id
            WHERE userrole.user_id = $1 AND role.name IN (${params});`,
            values: [user_id, ...role_names]
        });

        return result.rows.length != 0;
    }

    async getAllUsers() {
        const query = {
            text: 'SELECT * FROM "user"',
            values: []
        };

        return this.pool.query(query);
    }



    async getUser(user_id) {
        const query = {
            text: 'SELECT * FROM "user" WHERE id = $1',
            values: [user_id]
        };
        let result = (await this.pool.query(query)).rows[0];
        if (! result) {
            throw new Error();
        }
        return result;
    }

    async getEmail(user_id) {
        const query = {
            text: 'SELECT email FROM "user" WHERE id = $1',
            values: [user_id]
        };

        return (await this.pool.query(query)).rows[0].email;
    }

    async getId(user_email) {
        const query = {
            text: 'SELECT id FROM "user" WHERE email = $1',
            values: [user_email]
        };

        return (await this.pool.query(query)).rows[0].id;
    }

    async close() {
        this.pool.end();
    }
}

module.exports = UserRepository;