import React, { Component } from "react";
import PermaURLStorageContract from "./contracts/PermaURLStorage.json";
import { getWeb3Async, getWeb3ReadOnlyAsync } from "./utils/getWeb3";
import { getHashedURL, getURLForRedirect } from "./utils/Host";
import { Mode } from "./utils/mode";
import truffleContract from "truffle-contract";

import "./App.css";

//const MODE = Mode.MAINNET;
const MODE = Mode.ROPSTEN;

const Permissions = {
  READ_ONLY: "read_only",
  READ_WRITE: "read_write"
};

const ContractAddress = {
  MAINNET_ADDRESS: "0xf0625cF19647fe7689Bc7b0B8C54aFFb71d94cb3",
  ROPSTEN_ADDRESS: "0x0c72eb3f9ad6c762c17adae11ffd2458ce533ef4"
};

class App extends Component {
  state = {
		accounts: null,
		contract: null,
		fullURL: '',
		message: '',
		storageValue: 0,
		web3: null
	};

	async componentWillMount() {
		document.title = "CrispLnk: shorten dat link!"

		const locationHash = window.location.hash;

		// locationHash is more than just "#/"
		if (locationHash.length <= 2) {
      return;
    }

    const hashedURL = locationHash.substring(2);
    const components = await this.getWeb3Components(Permissions.READ_ONLY);

    const fullURLRaw = await components.contract.get.call(
      components.web3.utils.asciiToHex(hashedURL)
    );
    if (fullURLRaw === null) {
      return;
    }
    const fullURL = components.web3.utils.toAscii(fullURLRaw);
    window.location = getURLForRedirect(fullURL);
	}

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
					</form>
					<p> {this.state.message} </p>
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

		const components = await this.getWeb3Components(Permissions.READ_WRITE);

		// Set web3, accounts, and contract to the state, and then proceed with an
		// example of interacting with the contract's methods.
		this.setState({
			web3: components.web3,
			accounts: components.accounts,
			contract: components.contract
		});
	}

	async getWeb3Components(permissions) {
    try {
      // Get network provider and web3 instance.
			const web3 = (permissions === Permissions.READ_ONLY)
        ? await getWeb3ReadOnlyAsync(MODE)
        : await getWeb3Async();

      // Use web3 to get the user's accounts.
      var accounts = null;
			if (permissions === Permissions.READ_WRITE) {
				accounts = await web3.eth.getAccounts();
			}

      // Get the contract instance.
      const Contract = truffleContract(PermaURLStorageContract);
      Contract.setProvider(web3.currentProvider);

			var instance = null;
			if (MODE === Mode.MAINNET) {
				instance = await Contract.at(ContractAddress.MAINNET_ADDRESS);
			} else {
      	instance = await Contract.at(ContractAddress.ROPSTEN_ADDRESS);
			}

			return { web3, accounts, contract : instance };

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.log(error);
			throw error;
    }
	}

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

		this.setState({ message: 'failed to generate a suitable hash! Bummer.' });
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

		// set loading indicator
		this.setState({
			message: "Alrighty, sending to ethereum. Will take like 20 seconds. " + this.getEncouragement()
		});

		// send hash => original to ethereum
		try {
			await this.state.contract.set(
				this.state.web3.utils.asciiToHex(hashedURL),
				this.state.web3.utils.asciiToHex(this.state.fullURL),
				{ from: this.state.accounts[0] }
			);
		} catch (e) {
      console.error(e);
			this.setState({message: "There was an error posting to ethereum. Sad puppy :-("});
			return;
		}

		this.setState({
			message:
				<a className="App-link" href={getHashedURL(hashedURL)}>
				{getHashedURL(hashedURL)}
				</a>
		});
  }

	getEncouragement() {
		const encouragements = [
			"Be patient, and hold your horses!",
			"Close your eyes and think about your first true love!",
			"A good time to step back, and do some stretches!",
			"But if you stare real hard, it'll happen faster! Promise ;-)",
			"Close your eyes, and meditate on the sounds around you!",
			"Close your eyes, and meditate on your breathing!",
			"A test of your will power is commencing. Try your best to not switch to reddit or twitter!"
		];
		const randIndex = Math.floor(Math.random() * encouragements.length);
		return encouragements[randIndex];
	}
}

export default App;
