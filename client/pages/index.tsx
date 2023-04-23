import { Wallet, Transfer } from "../components";
import "@rainbow-me/rainbowkit/styles.css";
import {
  ConnectButton,
  getDefaultWallets,
  RainbowKitProvider
} from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import * as chain from 'wagmi/chains'
import { useAccount } from "wagmi";
import React, { Dispatch, SetStateAction, useState, useEffect } from "react";


const { chains, provider } = configureChains(
  [chain.sepolia],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "client",
  chains
});

const wagmiClient = createClient({
  autoConnect: false,
  connectors,
  provider
});
//TODO - extract this to another file for hooks
function useWalletAddress(): [string, Dispatch<SetStateAction<string>>] {
  const [savedAddress, setSavedAddress] = useState("");
  const { address, isConnected } = useAccount()

  useEffect(() => {
    if (isConnected) {
      setSavedAddress(address)
     } 
  }, [isConnected]);
 
 return [savedAddress, setSavedAddress]
}

export default function Home() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useWalletAddress()

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} modalSize="compact">
        <div className="container">
          <ConnectButton />
        </div>
        <div className="app">
          <Wallet
            balance={balance}
            setBalance={setBalance}
            address={address}
            setAddress={setAddress}
          />
          <Transfer setBalance={setBalance} address={address} />
        </div>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
