const { Sequelize, DataTypes } = require('sequelize');
const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const sequelize = new Sequelize('sqlite::memory:');
const Transaction = sequelize.define('Transaction', {
  // Model attributes are defined here
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    unique: true,
  },
  nonce: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  fromAddress: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  toAddress: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  }
}, {
  // Other model options go here
});
await Transaction.sync();

// balance:{
//   type: DataTypes.BIGINT,
//   allowNull: false
// }

const balances = {
  "0x1": 100,
  "0x2": 50,
  "0x3": 75,
};

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
