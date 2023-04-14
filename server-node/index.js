const db = require("./models");
const express = require("express");
const app = express();
const cors = require("cors");
const initAccounts = require("./initAccounts");
const port = 3042;

app.use(cors());
app.use(express.json());

db.sequelize.sync()
  .then(() => {
    console.log("Synced db.");
    initAccounts(db['Account'])
      .then(()=>console.log('accounts initialized'))
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

//TODO - close the db connection before shutdown
app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
