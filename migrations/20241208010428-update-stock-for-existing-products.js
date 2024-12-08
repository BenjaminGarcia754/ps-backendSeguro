'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Actualiza los registros existentes en la tabla `producto`
    await queryInterface.sequelize.query(`
            UPDATE producto
            SET stock = 10
            WHERE stock IS NULL OR stock = 0;
        `);
  },

  async down(queryInterface, Sequelize) {
    // Revertir los cambios, si es necesario (opcional)
    await queryInterface.sequelize.query(`
            UPDATE producto
            SET stock = 0
            WHERE stock = 10;
        `);
  }
};
