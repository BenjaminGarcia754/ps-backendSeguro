'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class carrito extends Model {
    static associate(models) {
      // Asociación con el modelo usuario
      carrito.belongsTo(models.usuario, {
        foreignKey: 'usuarioid'
      });

      // Asociación con el modelo producto
      carrito.belongsTo(models.producto, {
        foreignKey: 'productoid'
      });
    }
  }

  carrito.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    usuarioid: {
      type: DataTypes.STRING,
      allowNull: false
    },
    productoid: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    cantidad: {
      type: DataTypes.INTEGER, 
      allowNull: false,
      defaultValue: 1
    }
  }, {
    sequelize,
    freezeTableName: true,
    modelName: 'carrito'
  });

  return carrito;
};
