import React, { Component } from "react";
import PermaURLStorageContract from "./contracts/PermaURLStorage.json";
import { getWeb3Async } from "./utils/getWeb3";
import truffleContract from "truffle-contract";

import "./App.css";

class App extends Component {
  state = {
		accounts: null,
		contract: null,
		fullURL: '',
		message: '',
		storageValue: 0,
		web3: null
	};

  render() {
    return (
      <div className="App">
        <header className="App-header">
					<form onSubmit={this.onSubmit.bind(this)}>
						<input
							className="fullURLInput"
							onChange={this.onFullURLChange.bind(this)}
							placeholder="enter full url here"
							type="text"
							value={this.state.value}
						/>
						<input className="fullURLSubmit" type="submit" value="submit" />

						<p> {this.state.message} </p>
					</form>
        </header>
      </div>
    );
	}

	onFullURLChange(e) {
		e.preventDefault();
		this.setState({ fullURL: e.target.value });
	}

	async onSubmit(e) {
		e.preventDefault();
		if (this.state.fullURL === '') {
			this.setState({ message: 'yo! please enter a full url in the box' });
			return;
		}

		// ensure web3 is hooked up
		await this.initWeb3();

		const hashedURL = await this.getHashedURL(this.state.fullURL);
		if (hashedURL === null) {
			return;
		}
		this.setState({ message: 'hashed url is: ' + hashedURL});

		await this.saveToEthereum(hashedURL);
	}

	async initWeb3() {
		if (this.state.web3 !== null) {
			// already init'd
			return;
		}
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3Async();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const Contract = truffleContract(PermaURLStorageContract);
      Contract.setProvider(web3.currentProvider);
      const instance = await Contract.deployed();

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.log(error);
    }

	}

	// first, check if custom-url is specified, and if so,
	//   post that to storage
	// second, check if the fullURL has already been posted and return that
	// third, actually post to storage
	async getHashedURL(fullURL) {
		const bigHash = await this.sha256(fullURL);

		var totalAttempts = 0; // try 10 times and otherwise declare bankruptcy!
		while (totalAttempts < 10) {

			const hashedURL = bigHash.substring(0, 3 + totalAttempts);
			const prevSavedURL = await this.state.contract.get.call(this.state.web3.utils.fromAscii(hashedURL));
			if (prevSavedURL === null) {
				return hashedURL;
			}

			totalAttempts++;
		}

		this.setState({ message: 'failed to do the needful!' });
		return null;
	}

	// credit: https://gist.github.com/chrisveness/e5a07769d06ed02a2587df16742d3fdd
	async sha256(message) {
		// encode as UTF-8
    const msgUint8 = new TextEncoder('utf-8').encode(message + Date.now());
		// hash the message
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
		// convert hash to byte array
    const hashArray = Array.from(new Uint8Array(hashBuffer));
		// convert bytes to hex string
    const hashHex = hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
    return hashHex;
}

	async saveToEthereum(hashedURL) {

		// send hash => original to ethereum
		await this.state.contract.set(
			this.state.web3.utils.asciiToHex(hashedURL),
			this.state.web3.utils.asciiToHex(this.state.fullURL),
			{ from: this.state.accounts[0] }
		);

		// display result
		const savedFullURLRaw = await this.state.contract.get.call(this.state.web3.utils.asciiToHex(hashedURL));
		const savedFullURL = this.state.web3.utils.toAscii(savedFullURLRaw);

		this.setState({ message: "savedFullURL: " + savedFullURL + " with hash: " + hashedURL});
  }
}

export default App;
