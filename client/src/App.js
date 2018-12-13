import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./utils/getWeb3";
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

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const Contract = truffleContract(SimpleStorageContract);
      Contract.setProvider(web3.currentProvider);
      const instance = await Contract.deployed();

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.log(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;

		console.log('setting 5 in contract', accounts[0]);

    // Stores a given value, 5 by default.
    await contract.set(5, { from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.get();

		console.log('contract returned value', response.toNumber());

    // Update state with the result.
    this.setState({ storageValue: response.toNumber() });
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
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

	onSubmit(e) {
		e.preventDefault();
		console.log('hit submit for value ', this.state.fullURL);
		if (this.state.fullURL === '') {
			// TODO show UI that fullURL is empty
			this.setState({ message: 'yo! please enter a full url in the box' });
			return;
		}

		this.setState({ message: '' });
		this.saveToEthereum();
	}

	saveToEthereum() {
		// hash it

		// send hash => original to ethereum

		// display result
  }
}

export default App;
