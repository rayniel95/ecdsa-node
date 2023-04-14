import { Model, Sequelize } from "sequelize";

/**
 * 
 * @param {Sequelize} sequelize 
 * @returns
 */
export function defineModels(sequelize) {
    const Transaction = sequelize.define('Transaction', {
        // Model attributes are defined here
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
        }
    }, {
        // Other model options go here
    });

    const Account = sequelize.define('Account', {
        // Model attributes are defined here
        Address: {
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
        // Other model options go here
    });

    Account.hasMany(Transaction)
    Transaction.belongsTo(Account)

    return {Account, Transaction}
}
