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

await sequelize.sync()


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
