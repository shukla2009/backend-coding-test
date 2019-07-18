'use strict';

const port = 8010;
const Sequelize = require('sequelize');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');
const logger = require('./logger')(module)
const sequelize = new Sequelize({
    dialect: 'sqlite'
  });

db.serialize(() => {
    //buildSchemas(db);
    const app = require('./src/app')(sequelize);
    sequelize.sync();
    app.listen(port, () => logger.info(`App started and listening on port ${port}`));
});