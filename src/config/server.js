require('dotenv').config({ quiet: true });
const cors = require("cors");
const express = require('express');
const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true
}));

app.use(express.json()); // Untuk parsing application/json
app.use(express.urlencoded({ extended: true })); // Untuk parsing form data

const server = {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || "development",
};


module.exports = {
    server,
    app,
    express
};