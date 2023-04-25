import { useState } from "react";
import server from "./server";


export function Transfer({ address, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [privateKey, setPrivateKey] = useState("")

  async function transfer(evt: { preventDefault: () => void; }) {
    evt.preventDefault();

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Private Key
        <input
          placeholder="1, 2, 3..."
          value={privateKey}
          onChange={(e)=>setPrivateKey(e.target.value)}
        ></input>
      </label>
      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={(e)=>setSendAmount(e.target.value)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={(e)=>setRecipient(e.target.value)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}