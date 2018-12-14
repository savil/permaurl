import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
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
		this.setState({ fullURL: e.target.value });
	}

	async onSubmit(e) {
		e.preventDefault();
		console.log('hit submit for value ', this.state.fullURL);
		if (this.state.fullURL === '') {
			this.setState({ message: 'yo! please enter a full url in the box' });
			return;
		}

		// ensure web3 is hooked up
		await this.initWeb3();

		const hashed = await this.getHashedURL(this.state.fullURL);
		console.log('got hash', hashed);
		this.setState({ message: 'hashed url is: ' + hashed});
		this.saveToEthereum();
	}

	async initWeb3() {
		if (this.state.web3 !== null) {
			// already init'd
			return;
		}
		console.log('trying to init web3');
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3Async();
			console.log('got web3!');

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const Contract = truffleContract(SimpleStorageContract);
      Contract.setProvider(web3.currentProvider);
      const instance = await Contract.deployed();
			console.log('got contract instance');

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance });
			console.log('set web3 state');
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.log(error);
    }

		console.log('exiting initWeb3');
	}

	// first, check if custom-url is specified, and if so,
	//   post that to storage
	// second, check if the fullURL has already been posted and return that
	// third, actually post to storage
	async getHashedURL(fullURL) {
		return await this.sha256(fullURL);
	}

	// credit: https://gist.github.com/chrisveness/e5a07769d06ed02a2587df16742d3fdd
	async sha256(message) {
		// encode as UTF-8
    const msgUint8 = new TextEncoder('utf-8').encode(message);
		// hash the message
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
		// convert hash to byte array
    const hashArray = Array.from(new Uint8Array(hashBuffer));
		// convert bytes to hex string
    const hashHex = hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
    return hashHex;
}

	saveToEthereum() {
		// hash it

		// send hash => original to ethereum

		// display result
  }
}

export default App;
