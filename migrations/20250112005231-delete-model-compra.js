// Archivo de migración para eliminar la tabla "compra"
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Eliminar la tabla "compra"
    await queryInterface.dropTable('compra');
  },

  down: async (queryInterface, Sequelize) => {
    // Restaurar la tabla "compra" si se deshace la migración
    await queryInterface.createTable('compra', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      usuarioid: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      productoid: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      cantidad: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      total: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0.0,
      },
      fecha: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
};
