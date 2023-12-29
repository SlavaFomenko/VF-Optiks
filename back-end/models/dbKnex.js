const knex = require("knex");
const knexInstance = knex({
    client: 'mysql2',
    connection: {
        host: 'localhost',
        user: 'root',
        password: 'FomenkoViacheslav909011',
        database: 'OSO',
    }
});

module.exports = knexInstance