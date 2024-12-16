const mariadb = require('mariadb');

const config={
    host: 'localhost',
    user: 'mariadb_user',
    password: 'abc123',
    database: 'stockdb',
    port: '3306',
    connectionLimit:10


};

const pool= mariadb.createPool(config);

module.exports=pool;