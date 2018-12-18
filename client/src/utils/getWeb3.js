import Web3 from "web3";

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

export const getWeb3Async = async (options) => {
  // Modern dapp browsers...
	if (window.ethereum) {
		const web3 = new Web3(window.ethereum);

		if (options.accounts) {
			// Request account access if needed
			await window.ethereum.enable();
		}

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
