const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const swaggerJsdoc = require("swagger-jsdoc")
const swaggerUi = require("swagger-ui-express")
const use_router = require('../routers/user')
const device_router = require('../routers/device')
const condition_router = require('../routers/condition')
const errorMiddleware = require('../middleware/error')
const options = require("../swagger.json")
const specs = swaggerJsdoc(options)

const corsOptions = {
    exposedHeaders: "x-auth-token",
  };

module.exports = (app) => {
    app.use(express.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cors(corsOptions));
    app.use('/v1/user', use_router);
    app.use('/v1/device', device_router);
    app.use('/v1/condition', condition_router);
    app.use(errorMiddleware);
    app.use(
        "/api-docs",
        swaggerUi.serve,
        swaggerUi.setup(specs
            // ,{ explorer: true }
        )
    );
}