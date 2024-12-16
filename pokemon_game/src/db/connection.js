const mariadb = require('mariadb');

const config = {
    host: '127.0.0.1',
    user: 'root',
    password: 'r00tP4sw0rd',
    database: 'pokemon_game',
    port: 3306,
    conectionLimit: 10,
};


const pool = mariadb.createPool(config);

module.exports = pool;