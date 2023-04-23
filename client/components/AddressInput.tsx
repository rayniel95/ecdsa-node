import server from "./server";
import React, { Dispatch, SetStateAction, useState } from "react";
import { WalletProps } from "./Wallet";

//TODO - solve the problem of balance update when metamask is connected
export function AddressInput({ address, setAddress, balance, setBalance }: WalletProps) {
  const [isValidPublicKey, setIsValidPublicKey] = useState(false);

  async function onChange(evt: React.ChangeEvent<HTMLInputElement>) {
    const address: string = evt.target.value;

    setAddress(address);
    setIsValidPublicKey(validPublickKey(address))
  }

  async function onClick() {
    if (validPublickKey(address)) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } 
  }

  return (
    <div className="container wallet">
      <label>
        Wallet Address
        <input placeholder="Type an address, for example: 0x1" value={address} onChange={onChange}></input>
      </label>
      {
        isValidPublicKey ? <div className="balance">Balance: {balance}</div> : <div className="balance">That is not a valid public key</div>
      }
      <button onClick={onClick}>Get balance</button>
    </div>
  );
}

function validPublickKey(publicKey:string) {
  return publicKey && publicKey.split('x').length > 1 && publicKey.split('x')[1].length === 40 && isHex(publicKey) && publicKey.split('x')[0] === '0'
}

function isHex(h: string) {
  const a = BigInt(h);
  return `0x${a.toString(16)}` === h.toLowerCase()
}