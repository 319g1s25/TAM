const Sequelize = require('sequelize');

const sequelize = new Sequelize('ta_management', 'root', 'cs319Team1.#', {
    dialect: 'mysql',
    host: 'localhost'
  });  

module.exports = sequelize;
