'use strict';

const Sequelize = require('sequelize');
var assert = require('assert');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    logging: false
});
const Ride = require('../src/ride.model')(sequelize);
describe('Ride model test', () => {
    before((done) => {
        sequelize.sync().then(
            done()
        );
    });

    describe('create', () => {
        it('should create Ride object in database', (done) => {
            Ride.create({
                'start_lat': 45.45,
                'start_long': 72.72,
                'end_lat': 85.45,
                'end_long': 45.85,
                'rider_name': 'Tom Joon',
                'driver_name': 'Rider Cook',
                'driver_vehicle': 'Honda CRV'
            }).then(ride => {
                assert.equal(ride.rider_name,'Tom Joon'); 
            done();
            });
        });

        it('should throw error for all invalid properties', (done) => {
            Ride.create({}).then().catch(err => {
                assert.equal(err.errors.length,7); 
                done();
            });
        });
    });
});

