import db from "./models";
import express, { Express, Request, Response } from 'express';
import cors from "cors";
import initAccounts from "./initAccounts";
import { ModelStatic } from "sequelize";
import * as crypto from "./utils";

export const app = express();

const port = 3042;

app.use(cors());
app.use(express.json());

db.sequelize.sync()
  .then(() => {
    console.log("Synced db.");
    //TODO - use seeders to initialize the database
    // @ts-ignore
    initAccounts(db['Account'])
      .then(() => console.log('accounts initialized'))
  })
  .catch((err: any) => {
    console.log("Failed to sync db: " + err.message);
  });

//TODO - close the db connection before shutdown
app.get("/balance/:address", async (req, res) => {
  const { address } = req.params;
  //@ts-ignore
  const accounts: ModelStatic<any> = db["Account"]

  const account = (await accounts.findOrCreate({
    where: {
      address: address
    },
    defaults: {
      balance: 0
    }
  }))[0]
  res.send({ balance: account.balance });
});

app.post("/send", async (req, res) => {
  const { signature, recoverbit } = req.headers
  const { fromAddress, toAddress, amount, timestamp, nonce } = req.body;

  if (!(signature && recoverbit && fromAddress && toAddress &&
    amount && timestamp && nonce)) {
    res.status(400).send({
      message: 'Malformed request, some parameters are missing'
    })
    return
  }
  //@ts-ignore
  const accounts: ModelStatic<any> = db["Account"]
  //@ts-ignore
  const transactions: ModelStatic<any> = db["Transaction"]

  const toAccount = (await accounts.findOrCreate({
    where: {
      address: toAddress
    },
    defaults: {
      balance: 0
    }
  }))[0]

  const fromAccount = (await accounts.findOrCreate({
    where: {
      address: fromAddress
    },
    defaults: {
      balance: 0
    }
  }))[0]

  const transaction = transactions.create({
    timestamp,
    nonce,
    fromAddress,
    toAddress,
    amount,
    status: 'error'
  })
  //NOTE - check
  // timestamp >= last timestamp for that fromAddress, check
  // nonce is unique for that fromAddress, check enough founds,

  //NOTE - check message was signed by the person that sign 
  // the signature
  if (!crypto.verifySignature(
    JSON.stringify(req.body),
    signature as string,
    parseInt(recoverbit! as string)
  )) {
    res.status(401).send({
      message: "You are not the signer of this message"
    })
  }

  const address = crypto.getAddressFromSignature(
    JSON.stringify(req.body), signature as string, parseInt(recoverbit! as string)
  )
  //NOTE - check public key == fromAddress
  if (address != fromAccount.address) {
    res.status(401).send({
      message: "You can not move funds from the address of anther person"
    })
    return
  }

  const lastAccountTransaction = await transactions.findOne({
    where: {
      fromAddress: address
    },
    order:[
      [timestamp, 'DESC']
    ]
  })
  if (lastAccountTransaction.address > timestamp) {
    res.status(200).send({
      message: "You move your funds!!!"
    })
  }

  const doNotExistTransaction = await transactions.findOne({
    where: {
      nonce
    },
  })
  if (doNotExistTransaction) {
    res.status(401).send({
      message: "Hey!!!, this is a replay attack"
    })
    return
  }
  
  res.status(200).send({
    message: "You move your funds!!!"
  })
  //TODO - check that the transaction can be done, check auth
  // if (balances[sender] < amount) {
  //   res.status(400).send({ message: "Not enough funds!" });
  // } else {
  //   balances[sender] -= amount;
  //   balances[recipient] += amount;
  //   res.send({ balance: balances[sender] });
  // }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});