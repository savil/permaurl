import React, { Component } from "react";
import PermaURLStorageContract from "./contracts/PermaURLStorage.json";
import { getWeb3Async, getWeb3ReadOnlyAsync } from "./utils/getWeb3";
import { getHashedURL, getURLForRedirect } from "./utils/Host";
import ModalDialog from "./ModalDialog"
import { Mode } from "./utils/mode";
import { MissingWeb3Error } from "./utils/errors";
import Spinner from "./external/react-spinner/react-spinner";
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
    customHash: '',
    customHashTimeoutID: null,
		fullURL: '',
    isSpinnerNeeded: false,
    isSubmitEnabled: true,
    linkPreview: '',
		message: '',
    showMetamaskDialog: false,
		storageValue: 0,
		web3: null
	};

	async componentWillMount() {
		document.title = "CrispLink: shorten that link!"

		const locationHash = window.location.hash;

		// locationHash is more than just "#/"
		if (locationHash.length <= 2) {
      return;
    }

    const hash = locationHash.substring(2);
    const fullURL = await this.getFullURLFromHash(hash);
    window.location = getURLForRedirect(fullURL);
	}

  async isHashTaken(hash) {
    return (await this.getFullURLFromHash(hash)) !== null;
  }

  async getFullURLFromHash(hash) {
    const components = await this.getWeb3Components(Permissions.READ_ONLY);
    if (components === null) {
      return null;
    }

    const fullURLRaw = await components.contract.get.call(
      components.web3.utils.asciiToHex(hash)
    );
    if (fullURLRaw === null) {
      return null;
    }
    return components.web3.utils.toAscii(fullURLRaw);
  }

  render() {
    var spinner = null;
    if (this.state.isSpinnerNeeded) {
      spinner = <Spinner />;
    }

    return (
      <div className="App">
        <header className="App-header">
          <ModalDialog
            isVisible={this.state.showMetamaskDialog}
            key={this.state.showMetamaskDialog}
            onAcceptButtonClicked={this.onModalAcceptButtonClicked.bind(this)}
            dialogShouldClose={this.dialogShouldClose.bind(this)}
          >
            Next, Metamask will open a dialog.
            <br />
            <br />
            You will be asked to confirm the transaction for saving your URL to ethereum's blockchain.
            <br />
            <br />
          </ModalDialog>
					<form onSubmit={this.onSubmit.bind(this)}>
						<input
							className="fullURLInput"
							onChange={this.onFullURLChange.bind(this)}
							placeholder="enter full url here"
							type="text"
						/>
            <input
              className="customHashInput"
              onChange={this.onHashInputChange.bind(this)}
              placeholder="(optional) specify your vanity url"
              type="text"
            />
            <br />
						<input disabled={this.isSubmitDisabled()} className="fullURLSubmit" type="submit" value="submit" />
					</form>
          <p className="LinkPreview-container"> {this.state.linkPreview} </p>
					<p className="Message-container"> {this.state.message} </p>

          <div> {spinner} </div>
        </header>
      </div>
    );
	}

  isSubmitDisabled() {
    return this.state.isSpinnerNeeded;
  }

	onFullURLChange(e) {
		e.preventDefault();
		this.setState({ fullURL: e.target.value });
	}

  async onHashInputChange(e) {
    e.preventDefault();
    if (this.state.customHashTimeoutID) {
      clearTimeout(this.state.customHashTimeoutID);
    }

    const customHash = e.target.value;
    const timeoutID = setTimeout(async () => this.onHashInputChangeImpl(customHash), 200);
    this.setState({
      customHashTimeoutID: timeoutID
    });
    return;
  }

  async onHashInputChangeImpl(customHash) {
    this.setState({ customHash: customHash, customHashTimeoutID: null });

    // check if hash is taken
    // if taken, show message and disable submit
    const isHashTaken = await this.isHashTaken();
    if (isHashTaken) {
      this.setState({
        isSubmitEnabled: false,
        message: customHash + " has already been taken. Please try another one"
      });
      return;
    }

    // if not taken, then show preview
    this.setState({
      isSubmitEnabled: true,
      linkPreview: "your shortened url will be: " + getHashedURL(customHash)
    });
  }

	async onSubmit(e) {
		e.preventDefault();
		if (this.state.fullURL === '') {
			this.setState({ message: 'yo! please enter a full url in the box' });
			return;
		}

		// ensure web3 is hooked up
    try {
		  await this.initWeb3();
    } catch (error) {
      if (error instanceof MissingWeb3Error) {
        this.setState({
          message:
            <p>
              Alas, looks like you will need to
              install <a href="https://metamask.io" rel="noopener noreferrer" target="_blank">Metamask</a>.
              This lets us save your URL securely.
            </p>
        });
        return;
      }
    }

    this.setState({showMetamaskDialog: true});
  }

  dialogShouldClose() {
    this.setState({showMetamaskDialog: false});
  }

  async onModalAcceptButtonClicked() {

    var hashedURL = this.state.customHash;
    if (hashedURL === '') {
      hashedURL = await this.hashFullURL(this.state.fullURL);
      if (hashedURL === null) {
        return;
      }
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
    if (components === null) {
      return;
    }

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
      console.log(error);
			throw error;
    }
	}

	async hashFullURL(fullURL) {
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
      isSpinnerNeeded: true,
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
			this.setState({
        isSpinnerNeeded: false,
        message: "There was an error posting to ethereum. Sad puppy :-("
      });
			return;
		}

		this.setState({
      isSpinnerNeeded: false,
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
