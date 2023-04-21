import server from "./server";
import React, { Dispatch, SetStateAction, useState } from "react";


export interface WalletProps {
  address: string;
  setAddress: Dispatch<SetStateAction<string>>;
  balance: number;
  setBalance: Dispatch<SetStateAction<number>>
}

export function Wallet({ address, setAddress, balance, setBalance }: WalletProps) {
  const [isValidPublicKey, setIsValidPublicKey] = useState(false);

  async function onChange(evt: React.ChangeEvent<HTMLInputElement>) {
    const address: string = evt.target.value;

    setAddress(address);

    if (address && address.split('x').length > 1 && address.split('x')[1].length === 40 && isHex(address) && address.split('x')[0]==='0') {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setIsValidPublicKey(true)
      setBalance(balance);
    } else {
      setIsValidPublicKey(false)
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Wallet Address
        <input placeholder="Type an address, for example: 0x1" value={address} onChange={onChange}></input>
      </label>

      {
        isValidPublicKey? <div className="balance">Balance: {balance}</div>: <div className="balance">That is not a valid public key</div>
      }
    </div>
  );
}

function isHex(h: string) {
  const a = BigInt(h);
  return `0x${a.toString(16)}` === h.toLowerCase()
}