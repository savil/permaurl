import Web3 from "web3";
import HDWalletProvider from "truffle-hdwallet-provider";
import { Mode } from "./mode";

export const getWeb3 = () =>
  new Promise((resolve, reject) => {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener("load", async () => {
			try {
				const web3 = await getWeb3Async({accounts: true});
				resolve(web3);
			} catch (error) {
				reject(error);
			}
   });
  });

export const getWeb3ReadOnlyAsync = async(mode) => {
    // just some rando mnemonic. It has no money in it, and is used
    // for making read-only queries to infura/ethereum.
    const mnemonic = "truth project dilemma ramp hint dream custom produce country skate search view";
    const server = mode === Mode.ROPSTEN
      ? "https://ropsten.infura.io/v3/cb7d847147034deab366ab3169602261"
      : "https://mainnet.infura.io/v3/cb7d847147034deab366ab3169602261";

    const provider = new HDWalletProvider(mnemonic, server);
    return new Web3(provider);
}

export const getWeb3Async = async () => {

  // Modern dapp browsers...
	if (window.ethereum) {
		const web3 = new Web3(window.ethereum);

    // Request account access if needed
    await window.ethereum.enable();

		// Accounts now exposed
		return web3;
	}
	// Legacy dapp browsers...
	else if (window.web3) {
		// Use Mist/MetaMask's provider.
		const web3 = window.web3;
		return web3;
	}
	// Fallback to localhost; use dev console port by default...
	else {
		const provider = new Web3.providers.HttpProvider(
			"http://127.0.0.1:9545"
		);
		const web3 = new Web3(provider);
		return web3;
	}
}

export default getWeb3;
