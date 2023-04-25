import { useState } from "react";
import server from "./server";
import { useAccount, useSignMessage } from "wagmi";
import { getRandomBytesSync } from "ethereum-cryptography/random";


export function Transfer({ address, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [privateKey, setPrivateKey] = useState("")

  const { isConnected } = useAccount()
  const { signMessage } = useSignMessage({
    async onSuccess(data, variables: { message: string }) {
     await onSuccessSignature(data, variables, setBalance)
    },
  })

  async function transfer(evt: { preventDefault: () => void; }) {
    evt.preventDefault();
    const message = {
      fromAddress: address,
      toAddress: recipient,
      amount: sendAmount,
      timestamp: Date.now(),
      nonce: new DataView(
        getRandomBytesSync(4).buffer, 0
      ).getUint32(0, false)
    }
    let signature: string
    if (isConnected) {
      signMessage({ message: JSON.stringify(message) })
      return
    } else {
      signature = signMessagePrivKey(message, privateKey)
    }

    const headers = {
      signature
    }
    try {
      const {
        data: { balance },
      } = await server.post(`send`, message, { headers });
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
        <input disabled={isConnected}
          placeholder="1, 2, 3..."
          value={privateKey}
          onChange={(e) => setPrivateKey(e.target.value)}
        ></input>
      </label>
      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={(e) => setSendAmount(e.target.value)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

async function onSuccessSignature(data, variables: { message: string }, setBalance) {
  const headers = {
    signature: data
  }
  try {
    const {
      data: { balance },
    } = await server.post(`send`, JSON.parse(variables.message), { headers });
    setBalance(balance);
  } catch (ex) {
    alert(ex.response.data.message);
  }
}

function signMessagePrivKey(message: any, privateKey: string): string {
  return ''
}