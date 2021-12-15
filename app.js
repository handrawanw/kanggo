const express = require("express");

const app = express();

const PORT = process.env.PORT || 2021;

// dotenv
require("dotenv").config();
// dotenv

// database
require("./dbConnect")();
// database

// cors
const cors = require("cors");
const corsConfig = require("./middleware/cors");
// cors

// helmet
const helmet = require("helmet");
app.use(helmet.hidePoweredBy());
app.use(helmet());
// helmet

// tobusy
const toobusy = require("toobusy-js");
app.use(function (req, res, next) {
    if (toobusy()) {
        res.status(503).json({
            message: `Server is busy right now, Please try again later`,
            status: 503
        });
    } else {
        next();
    }
});
// tobusy

// anti nosql injection
const MongoSanitize = require("express-mongo-sanitize");
app.use(MongoSanitize({
    replaceWith: '_'
}));
// anti nosql injection

// for form request
app.use(express.urlencoded({ extended: true }));
app.use(express.json({}));
// for form request

// Rest API
const RestAPI = require("./router/index");
const ErrorHandler = require("./middleware/errHandler");
app.use("/api/v1", cors(corsConfig), RestAPI, ErrorHandler);
// Rest API


app.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`Server is running ${PORT}`);
});
