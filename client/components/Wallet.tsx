import server from "./server";
import React, { Dispatch, SetStateAction, useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { AddressInput } from "./AddressInput";

export interface WalletProps {
  address: string;
  setAddress: Dispatch<SetStateAction<string>>;
  balance: number;
  setBalance: Dispatch<SetStateAction<number>>
}

export function Wallet({balance, setBalance, address, setAddress}: WalletProps) {

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>
      <AddressInput
        balance={balance}
        setBalance={setBalance}
        address={address}
        setAddress={setAddress}
      />
    </div>
  );
}