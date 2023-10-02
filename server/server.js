'use strict'; 
const path = require('path'); 
require('dotenv').config({
    path: path.join(__dirname, './config/config.env')
});
const {PORT, HOST, API_VERSION, MONGO_URI} = process.env;
const express = require('express');
const bodyParser = require("body-parser");
const customErrorHandler = require("./middleware/customErrorHandler");
const connectMongoDB = require("./helper/database/connectMongoDB");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const corsOptionsDelegate = require("./helper/cors");
const app = express();
app.use(cors(corsOptionsDelegate));
app.use(helmet({
    xssFilter: true,
    referrerPolicy: {policy: "no-referrer"},
    permittedCrossDomainPolicies: {permittedPolicies: "master-only"},
    originAgentCluster: true,
    ieNoOpen: true,
    hsts: true,
    hidePoweredBy: true,
    frameguard: true,
    expectCt: true,
    dnsPrefetchControl: true,
    crossOriginResourcePolicy: true,
    crossOriginOpenerPolicy: true,
    crossOriginEmbedderPolicy: true,
    contentSecurityPolicy: true,
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(`/api/${API_VERSION}`, require('./router'));
app.all('*', require('./middleware/notFound'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(customErrorHandler);
connectMongoDB(mongoose, MONGO_URI).then(() => {
    console.log("MongoDB connected!");
    app.listen(PORT, (err) => {
        if (err) {
            console.log("Server error: " + err);
        }
        console.log(`Server is running on http://${HOST}:${PORT}/api/${API_VERSION}`);
    });
}).catch((err) => {
    console.log("MongoDB connection error: " + err);
});


