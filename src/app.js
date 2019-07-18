'use strict';

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const logger = require('../logger')(module)
const SERVER_ERROR = { error_code: 'SERVER_ERROR', message: 'Unknown error' }

const logRequest = (req, res, next) => {
    logger.info(`${req.method} ${req.originalUrl}`)
    res.on('finish', () => {
        logger.info(`${res.statusCode} ${res.statusMessage}; ${res.get('Content-Length') || 0}b sent`)
    })
    next()
}
app.use(logRequest);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


module.exports = (db) => {
    const Ride = require('./ride.model')(db);

    app.get('/health', (req, res) => res.send('Healthy'));

    app.post('/rides', jsonParser, async (req, res) => {
        try {
            let ride = await Ride.create(req.body);
            logger.info('Ride created successfully' + JSON.stringify(ride));
            res.status(201).send(ride);
        } catch (err) {
            const errors = err.errors.map(m => m.message);
            logger.error(errors);
            res.status(400).send({
                error_code: 'VALIDATION_ERROR',
                message: errors[0]
            })
        }
    });

    app.get('/rides', async (req, res) => {
        let options = {
            offset: req.query.offset ? req.query.offset : 0,
            limit: req.query.limit ? req.query.limit : 5,
            order: [['rideID', 'ASC']]
        };
        try {
            let rides = await Ride.findAll(options)
            if (rides.length === 0) {
                return res.status(400).send({
                    error_code: 'RIDES_NOT_FOUND_ERROR',
                    message: 'Could not find any rides'
                });
            }
            else {
                res.send(rides);
            }
        } catch (err) {
            logger.error(err);
            return res.status(500).send(SERVER_ERROR);
        }
    });

    app.get('/rides/:id', async (req, res) => {
        try {
            let ride = await Ride.findByPk(req.params.id)
            if (ride)
                res.send(ride);
            else
                res.status(400).send({
                    'error_code': 'RIDES_NOT_FOUND_ERROR',
                    'message': 'Could not find any rides'
                });
        } catch (err) {
            logger.error(err);
            res.status(400).send(SERVER_ERROR);
        }
    });
    return app;
};
