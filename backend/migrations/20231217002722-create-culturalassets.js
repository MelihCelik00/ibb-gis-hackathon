'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Culturalassets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      geom: {
        type: Sequelize.GEOMETRY
      },
      fid: {
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      disctrict: {
        type: Sequelize.STRING
      },
      lat: {
        type: Sequelize.DOUBLE
      },
      long: {
        type: Sequelize.DOUBLE
      },
      type: {
        type: Sequelize.STRING
      },
      desc: {
        type: Sequelize.STRING
      },
      image: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Culturalassets');
  }
};