const dbPool = require('./database');
const {server, app, express} = require('./server');

module.exports = {
    dbPool,
    server,
    app,
    express
}