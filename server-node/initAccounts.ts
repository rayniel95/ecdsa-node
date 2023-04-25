import { ModelStatic } from "sequelize";

export default async (account: ModelStatic<any>) => {
    await account.findOrCreate({
        where: {
            address: '0x8b2ff5c6bb4685e48707fc69a3729ee9b53162d7'
        },
        defaults: {
            balance: 100
        }
    })

    await account.findOrCreate({
        where: {
            address: '0x456cfd7ef7554290a1931cdd9f1d28623723872e'
        },
        defaults: {
            balance: 100
        }
    })

    await account.findOrCreate({
        where: {
            address: '0x70b4d825a9ab0bfebb438d972d9d9a38690cfdd1'
        },
        defaults: {
            balance: 100
        }
    })

    await account.findOrCreate({
        where: {
            address: '0x5f0b5C7D5939D6fEd09B27c7449F4D7d813AEfe4'
        },
        defaults: {
            balance: 100
        }
    })
};