var config = module.exports = {};

var node_env = process.env.NODE_ENV || "development";
if (node_env === "development") {
    var dotenv = require('dotenv').config();
    config.connectionString = "postgres://localhost/ThespianRegistration";
    config.googleReturn = process.env.GOOGLE_CALLBACK_DEV;
} else if (node_env === "production") {
    config.connectionString = "postgres://" +
        process.env.RDS_USERNAME + ":" +
        process.env.RDS_PASSWORD + "@" +
        process.env.RDS_HOSTNAME + ":" +
        process.env.RDS_PORT + "/" +
        process.env.RDS_DB_NAME;
    config.googleReturn = process.env.GOOGLE_CALLBACK_PROD;
}