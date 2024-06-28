'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Distances', {
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
      inputId: {
        type: Sequelize.INTEGER
      },
      targetId: {
        type: Sequelize.INTEGER
      },
      distance: {
        type: Sequelize.DOUBLE
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
    await queryInterface.dropTable('Distances');
  }
};