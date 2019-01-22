import Web3 from "web3";
import HDWalletProvider from "truffle-hdwallet-provider";
import { Mode } from "./mode";
import { MissingWeb3Error } from "./errors";

export const getWeb3 = (mode: string) =>
  new Promise((resolve, reject) => {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener("load", async () => {
			try {
				const web3 = await getWeb3Async(mode);
				resolve(web3);
			} catch (error) {
				reject(error);
			}
   });
  });

export const getWeb3ReadOnlyAsync = async(mode: string) => {
    // just some rando mnemonic. It has no money in it, and is used
    // for making read-only queries to infura/ethereum.
    const mnemonic = "truth project dilemma ramp hint dream custom produce country skate search view";
    const server = mode === Mode.ROPSTEN
      ? "https://ropsten.infura.io/v3/cb7d847147034deab366ab3169602261"
      : "https://mainnet.infura.io/v3/cb7d847147034deab366ab3169602261";

    const provider = new HDWalletProvider(mnemonic, server);
    return new Web3(provider);
}

export const getWeb3Async = async (mode: string) => {

  // Modern dapp browsers...
	if ((window as any).ethereum) {
		const web3 = new Web3((window as any).ethereum);

    // Request account access if needed
    await (window as any).ethereum.enable();

		// Accounts now exposed
		return web3;
	}
	// Legacy dapp browsers...
	else if ((window as any).web3) {
		// Use Mist/MetaMask's provider.
		const web3 = (window as any).web3;
		return web3;
	}
	// Fallback to localhost; use dev console port by default...
	else if (mode === Mode.LOCALHOST) {
		const provider = new Web3.providers.HttpProvider(
			"http://127.0.0.1:9545"
		);
		const web3 = new Web3(provider);
		return web3;
	} else {
    throw new MissingWeb3Error("no web3 provider found");
  }
}

export default getWeb3;
