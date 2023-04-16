import db from "./models";
import express, { Express, Request, Response } from 'express';
import cors from "cors";
import initAccounts from "./initAccounts";

const app = express();

const port = 3042;

app.use(cors());
app.use(express.json());

db.sequelize.sync()
  .then(() => {
    console.log("Synced db.");
    // @ts-ignore
    initAccounts(db['Account'])
      .then(()=>console.log('accounts initialized'))
  })
  .catch((err: any) => {
    console.log("Failed to sync db: " + err.message);
  });

//TODO - close the db connection before shutdown
app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = 0
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

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

function setInitialBalance(address: any) {
  // if (!balances[address]) {
  //   balances[address] = 0;
  // }
}
