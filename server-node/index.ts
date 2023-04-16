import db from "./models";
import express, { Express, Request, Response } from 'express';
import cors from "cors";
import initAccounts from "./initAccounts";
import { ModelStatic } from "sequelize";


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

  const account = await accounts.findOrCreate({
    where: {
      address: address
    },
    defaults: {
      balance: 0
    }
  })
  res.send({ balance: account[0].balance });
});

app.post("/send", async (req, res) => {
  const { fromAddress, toAddress, amount, timestamp, nonce } = req.body;

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
  // setInitialBalance(sender);
  // setInitialBalance(recipient);
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
