'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Transaction)
    }
  }
  Account.init({
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    balance: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0
    }
  }, {
    sequelize,
    modelName: 'Account',
  });
  return Account;
};