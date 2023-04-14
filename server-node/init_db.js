import { Model } from "sequelize"


/**
 * init the database if there is not item.
 * @param {Model} account 
 */
export async function initDatabase(account) {
    await account.findOrCreate({
        where: {
            address: '0x8b2ff5c6bb4685e48707fc69a3729ee9b53162d7'
        }
    })

    await account.findOrCreate({
        where: {
            address: '0x456cfd7ef7554290a1931cdd9f1d28623723872e'
        }
    })

    await account.findOrCreate({
        where: {
            address: '0x70b4d825a9ab0bfebb438d972d9d9a38690cfdd1'
        }
    })
}