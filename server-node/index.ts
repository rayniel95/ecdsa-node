import db from "./models";
import express, { Express, Request, Response } from 'express';
import cors from "cors";
import initAccounts from "./initAccounts";
import { ModelStatic } from "sequelize";
import * as crypto from "./utils";
import { toHex } from "ethereum-cryptography/utils";

const app = express();

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
  const { signature, recoverBit } = req.headers
  const { fromAddress, toAddress, amount, timestamp, nonce } = req.body;

  if (!(signature && recoverBit && fromAddress && toAddress &&
    amount && timestamp && nonce)) {
    res.status(400).send({
      message: 'Malformed request, some parameters are missing'
    })
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
  //NOTE - check public key == fromAddress, check message 
  // was signed by the person that sign the signature, check
  // timestamp >= last timestamp for that fromAddress, check
  // nonce is unique for that fromAddress, check enough founds,
  //TODO - check the typing here
  const address = crypto.getAddressFromSignature(
    JSON.stringify(req.body), signature as string, parseInt(recoverBit! as string)
  )
  if (address != fromAccount.address) {
    res.status(401).send({ message: "This is not your address" })
  }

  if (!crypto.verifySignature(
    JSON.stringify(req.body),
    signature as string,
    parseInt(recoverBit! as string)
  )) {
    res.status(401).send({ message: "You are not the signer of this message" })
  }
  
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
