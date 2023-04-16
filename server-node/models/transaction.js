'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Account)
    }
  }
  Transaction.init({
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    nonce: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fromAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    toAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.BigInt,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM,
      values: ['success', 'error']
    }
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};