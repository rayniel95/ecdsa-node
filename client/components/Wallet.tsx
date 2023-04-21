import server from "./server";
import { Dispatch, SetStateAction } from "react";


interface WalletProps {
  address: string; 
  setAddress: Dispatch<SetStateAction<string>>;
  balance: number; 
  setBalance: Dispatch<SetStateAction<number>>
}

export function Wallet({ address, setAddress, balance, setBalance }: WalletProps) {

  async function onChange(evt) {
    const address = evt.target.value;

    setAddress(address);
    if (address && address.split('x')[1].length == 40) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Wallet Address
        <input placeholder="Type an address, for example: 0x1" value={address} onChange={onChange}></input>
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}