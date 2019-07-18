'use strict';

const request = require('supertest');
const Sequelize = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite'
});
const app = require('../src/app')(sequelize);

describe('API tests', () => {
    before((done) => {
        sequelize.sync().then(
            done()
        );
    });

    describe('GET /health', () => {
        it('should return health', (done) => {
            request(app)
                .get('/health')
                .expect('Content-Type', /text/)
                .expect(200, done);
        });
    });

    describe('GET /rides empty', () => {
        it('Should not get any rides in database', (done) => {
            request(app)
                .get('/rides')
                .expect('Content-Type', /json/)
                .expect(400, {
                    'error_code': 'RIDES_NOT_FOUND_ERROR',
                    'message': 'Could not find any rides'
                }, done);
        });
    });

    describe('POST /rides', () => {
        it('Should insert a ride in database', (done) => {
            request(app)
                .post('/rides')
                .send({
                    'start_lat': 45.45,
                    'start_long': 72.72,
                    'end_lat': 85.45,
                    'end_long': 45.85,
                    'rider_name': 'Tom Joon',
                    'driver_name': 'Rider Cook',
                    'driver_vehicle': 'Honda CRV'
                })
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    if (!('rideID' in res.body)) throw new Error('Ride Creation Failed');
                    return done();
                });
        });
        it('Should throw error while creating ride with invalid start coordinate', (done) => {
            request(app)
                .post('/rides')
                .send({
                    'start_lat': 145.45,
                    'start_long': 72.72,
                    'end_lat': 85.45,
                    'end_long': 45.85,
                    'rider_name': 'Tom Joon',
                    'driver_name': 'Rider Cook',
                    'driver_vehicle': 'Honda CRV'
                })
                .expect('Content-Type', /json/)
                .expect(400, {
                    error_code: 'VALIDATION_ERROR',
                    message: 'Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively'
                }, done);
        });
        it('Should throw error while creating ride with invalid end coordinate', (done) => {
            request(app)
                .post('/rides')
                .send({
                    'start_lat': 45.45,
                    'start_long': 72.72,
                    'end_lat': 185.45,
                    'end_long': 45.85,
                    'rider_name': 'Tom Joon',
                    'driver_name': 'Rider Cook',
                    'driver_vehicle': 'Honda CRV'
                })
                .expect('Content-Type', /json/)
                .expect(400, {
                    error_code: 'VALIDATION_ERROR',
                    message: 'End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively'
                }, done);
        });
        it('Should throw error while creating ride with invalid rider_name', (done) => {
            request(app)
                .post('/rides')
                .send({
                    'start_lat': 45.45,
                    'start_long': 72.72,
                    'end_lat': 85.45,
                    'end_long': 45.85,
                    'rider_name': '',
                    'driver_name': 'Rider Cook',
                    'driver_vehicle': 'Honda CRV'
                })
                .expect('Content-Type', /json/)
                .expect(400, {
                    error_code: 'VALIDATION_ERROR',
                    message: 'Rider name must be a non empty string'
                }, done);
        });

        it('Should throw error while creating ride with invalid driver_name', (done) => {
            request(app)
                .post('/rides')
                .send({
                    'start_lat': 45.45,
                    'start_long': 72.72,
                    'end_lat': 85.45,
                    'end_long': 45.85,
                    'rider_name': 'Rider Cook',
                    'driver_name': '',
                    'driver_vehicle': 'Honda CRV'
                })
                .expect('Content-Type', /json/)
                .expect(400, {
                    error_code: 'VALIDATION_ERROR',
                    message: 'Driver name must be a non empty string'
                }, done);
        });
        it('Should throw error while creating ride with invalid driver_vehicle', (done) => {
            request(app)
                .post('/rides')
                .send({
                    'start_lat': 45.45,
                    'start_long': 72.72,
                    'end_lat': 85.45,
                    'end_long': 45.85,
                    'rider_name': 'Rider Cook',
                    'driver_name': 'Rider Cook',
                    'driver_vehicle': ''
                })
                .expect('Content-Type', /json/)
                .expect(400, {
                    error_code: 'VALIDATION_ERROR',
                    message: 'Driver vehicle must be a non empty string'
                }, done);
        });

    });

    describe('GET /rides', () => {
        it('Should get all rides in database', (done) => {
            request(app)
                .get('/rides')
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    if (res.body.length !== 1) throw new Error('Ride not found');
                    if (res.body[0]['rideID'] !== 1) throw new Error('Invalid ride Found');
                    return done();
                });
        });
    });

    describe('GET /rides/:id', () => {
        it('Should get a ride from database corresponding to id', (done) => {
            request(app)
                .get('/rides/1')
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    if (res.body['rideID'] !== 1) throw new Error('No ride corresponding to id 1');
                    return done();
                });
        });

        it('Should try to fetch ride not exists', (done) => {
            request(app)
                .get('/rides/2')
                .expect('Content-Type', /json/)
                .expect(400, {
                    'error_code': 'RIDES_NOT_FOUND_ERROR',
                    'message': 'Could not find any rides'
                }, done);
        });

        it('Should prevent sql injection', (done) => {
            request(app)
                .get('/rides/1 OR 1=1')
                .expect('Content-Type', /json/)
                .expect(400, {
                    'error_code': 'RIDES_NOT_FOUND_ERROR',
                    'message': 'Could not find any rides'
                }, done);
        });
    });
});