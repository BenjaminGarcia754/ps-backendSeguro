'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class compra extends Model {
    static associate(models) {
      compra.belongsTo(models.producto, { foreignKey: 'productoid' });
    }
  }

  compra.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    correousuario: {
      type: DataTypes.STRING,
      allowNull: false
    },
    productoid: {
      type: DataTypes.STRING,
      allowNull: false
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    total: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0.0
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    freezeTableName: true,
    modelName: 'compra',
  });
  return compra;
};
