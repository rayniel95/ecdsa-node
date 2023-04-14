import { Model } from "sequelize"


/**
 * 
 * @param {Model} account 
 */
export async function initDatabase(account) {
    await account.findOrCreate({
        where: {
            address: 'here one address'
        }
    })

    await account.findOrCreate({
        where: {
            address: 'here two address'
        }
    })

    await account.findOrCreate({
        where: {
            address: 'here three address'
        }
    })
}