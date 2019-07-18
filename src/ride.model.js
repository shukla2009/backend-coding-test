const Sequelize = require('sequelize');
const {
    START_LAT_LONG_INVALID,
    END_LAT_LONG_INVALID,
    RIDER_NAME_INVALID,
    DRIVER_NAME_INVALID,
    DRIVER_VEHICLE_INVALID
} = require('./ride.model.error');



class Ride extends Sequelize.Model { }
module.exports = (sequelize) => {
    return Ride.init(
        {
            rideID: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
            start_lat: {
                type: Sequelize.FLOAT,
                allowNull: false,
                field: 'startLat',
                validate: {
                    min: { args: -90, msg: START_LAT_LONG_INVALID },
                    max: { args: 90, msg: START_LAT_LONG_INVALID },
                    notNull: { msg: START_LAT_LONG_INVALID }
                }
            },
            start_long: {
                type: Sequelize.FLOAT,
                allowNull: false,
                field: 'startLong',
                validate: {
                    min: { args: -180, msg: START_LAT_LONG_INVALID },
                    max: { args: 180, msg: START_LAT_LONG_INVALID },
                    notNull: { msg: START_LAT_LONG_INVALID }
                }
            },
            end_lat: {
                type: Sequelize.FLOAT,
                allowNull: false,
                field: 'endLat',
                validate: {
                    min: { args: -90, msg: END_LAT_LONG_INVALID },
                    max: { args: 90, msg: END_LAT_LONG_INVALID },
                    notNull: { msg: END_LAT_LONG_INVALID }
                }
            },
            end_long: {
                type: Sequelize.FLOAT,
                allowNull: false,
                field: 'endLong',
                validate: {
                    min: { args: -180, msg: END_LAT_LONG_INVALID },
                    max: { args: 180, msg: END_LAT_LONG_INVALID },
                    notNull: { msg: END_LAT_LONG_INVALID }
                }
            },
            rider_name: {
                type: Sequelize.STRING,
                allowNull: false,
                field: 'riderName',
                validate: {
                    notEmpty: { msg: RIDER_NAME_INVALID },
                    notNull: { msg: RIDER_NAME_INVALID }
                }
            },
            driver_name: {
                type: Sequelize.STRING,
                allowNull: false,
                field: 'driverName',
                validate: {
                    notEmpty: { msg: DRIVER_NAME_INVALID },
                    notNull: { msg: DRIVER_NAME_INVALID }
                }
            },
            driver_vehicle: {
                type: Sequelize.STRING,
                allowNull: false,
                field: 'driverVehicle',
                validate: {
                    notEmpty: { msg: DRIVER_VEHICLE_INVALID },
                    notNull: { msg: DRIVER_VEHICLE_INVALID }
                }
            },
            created: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            },
        },

        {
            sequelize,
            modelName: 'Ride',
            timestamps: false,
            logging:false
        }
    )
};

