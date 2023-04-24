import server from "./server";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { WalletProps } from "./Wallet";

export function AddressInput({ address, setAddress, balance, setBalance }: WalletProps) {
  const [isValidPublicKey, setIsValidPublicKey] = useState(false);

  useEffect(() => {
    setIsValidPublicKey(validPublickKey(address))
  }, [address]);

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
        <input placeholder="Type an address, for example: 0x1" value={address} onChange={(e)=>setAddress(e.target.value)}></input>
      </label>
      {
        isValidPublicKey ? <div className="balance">Balance: {balance}</div> : <div className="balance">That is not a valid public key</div>
      }
      <button onClick={onClick}>Get balance</button>
    </div>
  );
}

function validPublickKey(publicKey: string) {
  //TODO - use a regex to input validation
  return publicKey && publicKey.split('x').length > 1 && publicKey.split('x')[1].length === 40 && isHex(publicKey) && publicKey.split('x')[0] === '0'
}

function isHex(h: string) {
  const a = BigInt(h);
  return `0x${a.toString(16)}` === h.toLowerCase()
}