import React, { Component } from "react";
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import * as actions from "./actions/";
import { MissingWeb3Error } from "./utils/errors";
import { getURLForRedirect } from "./utils/Host";
import Message from "./containers/Message";
import PermaURLForm from "./containers/PermaURLForm";
import PermaURLModalDialog from "./containers/PermaURLModalDialog";
import { getFullURLFromHash, getWeb3Components, Permissions } from "./utils/PermaURLUtil";
import Spinner from "./external/react-spinner/react-spinner";
import { FormState, MessageKind, StoreState, Web3State } from "./types/";

import "./App.css";

interface AppProps {
  formState: FormState,
  isMetamaskDialogVisible: boolean,
  isSpinnerNeeded: boolean,
  onMetamaskDialogAcceptClicked: () => void,
  onMetamaskDialogShouldClose: () => void,
  onSavedHashToEthereum:
    (payload: {
      messageKind: MessageKind,
      isSpinnerNeeded: boolean,
      savedHash: string,
    }) => void,
  onSendingHashToEthereum:
    (payload: {
      messageKind: MessageKind,
      isSpinnerNeeded: boolean,
    }) => void,
  updateWeb3State: (newWeb3State: Web3State) => void,
  updateMessage: (newMessage: MessageKind) => void,
  web3State: Web3State,
}

interface AppState {
}

class App extends Component<AppProps, AppState> {

	async componentWillMount() {
		document.title = "CrispLink: shorten that link!"

		const locationHash = window.location.hash;

		// locationHash is more than just "#/"
		if (locationHash.length <= 2) {
      return;
    }

    const hash = locationHash.substring(2);
    const fullURL = await getFullURLFromHash(hash);
    if (fullURL === null) {
      return;
    }
    window.location.href = getURLForRedirect(fullURL);
	}


  render() {
    return (
      <div className="App">
        <header className="App-header">
          <PermaURLModalDialog
            isVisible={this.props.isMetamaskDialogVisible}
            onAcceptButtonClicked={this.onMetamaskDialogAcceptClicked.bind(this)}
            onDialogShouldClose={this.props.onMetamaskDialogShouldClose}
          />
          <PermaURLForm />
          <Message />
          <div> {this.props.isSpinnerNeeded ? <Spinner /> : null} </div>
        </header>
      </div>
    );
	}

  async onMetamaskDialogAcceptClicked() {
    this.props.onMetamaskDialogAcceptClicked();

		// ensure web3 is hooked up
    try {
		  await this.initWeb3();
    } catch (error) {
      if (error instanceof MissingWeb3Error) {
        this.props.updateMessage(MessageKind.INSTALL_METAMASK);
        return;
      }
    }

    let hashedURL = this.props.formState.customHash;
    if (hashedURL === '' || hashedURL === null) {
      // if user has not specified a desired hash,
      // then fallback to generating one ourselves
      let autogeneratedHash = await this.hashFullURL(this.props.formState.fullURL);
      if (autogeneratedHash === null) {
        return;
      }
      hashedURL = autogeneratedHash;
    }

		await this.saveToEthereum(hashedURL);
	}

	async initWeb3() {
		if (this.props.web3State.web3 !== null) {
			// already init'd
			return;
		}

		const components = await getWeb3Components(Permissions.READ_WRITE);
    if (components === null) {
      return;
    }

		// Set web3, accounts, and contract to the state, and then proceed with an
		// example of interacting with the contract's methods.
    this.props.updateWeb3State({
			web3: components.web3,
			accounts: components.accounts,
			contract: components.contract
		});
	}

	async hashFullURL(fullURL: string): Promise<string | null> {
		const bigHash = await this.sha256(fullURL);

		let totalAttempts = 0; // try 10 times and otherwise declare bankruptcy!
		while (totalAttempts < 10) {

			const hashedURL = bigHash.substring(0, 3 + totalAttempts);
			const prevSavedURL = await this.props.web3State.contract.get.call(
        this.props.web3State.web3.utils.fromAscii(hashedURL)
      );
			if (prevSavedURL === null) {
				return hashedURL;
			}

			totalAttempts++;
		}

    this.props.updateMessage(MessageKind.FAILED_TO_GENERATE_HASH);
		return null;
	}

	// credit: https://gist.github.com/chrisveness/e5a07769d06ed02a2587df16742d3fdd
	async sha256(message: string): Promise<string> {
		// encode as UTF-8
    const msgUint8 = (new TextEncoder()).encode(message + Date.now());
		// hash the message
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
		// convert hash to byte array
    const hashArray = Array.from(new Uint8Array(hashBuffer));
		// convert bytes to hex string
    const hashHex = hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
    return hashHex;
}

	async saveToEthereum(hashedURL: string): Promise<void> {
		// set loading indicator
    this.props.onSendingHashToEthereum({
      messageKind: MessageKind.SENDING_TO_ETHEREUM,
      isSpinnerNeeded: true,
    });

		// send hash => original to ethereum
		try {
			await this.props.web3State.contract.set(
				this.props.web3State.web3.utils.asciiToHex(hashedURL),
				this.props.web3State.web3.utils.asciiToHex(this.props.formState.fullURL),
				{ from: this.props.web3State.accounts[0] }
			);
		} catch (e) {
      console.error(e);
      this.props.onSendingHashToEthereum({
        messageKind: MessageKind.ERROR_SENDING_TO_ETHEREUM,
        isSpinnerNeeded: false,
      });
			return;
		}

    this.props.onSavedHashToEthereum({
      isSpinnerNeeded: false,
      messageKind: MessageKind.HASHED_URL_WITH_COPY,
      savedHash: hashedURL,
    });
  }
}

function mapDispatchToProps(dispatch: Dispatch<actions.PermaURLAction>) {
  return {
    onMetamaskDialogShouldClose: () => dispatch(actions.modalCancelClicked()),
    onMetamaskDialogAcceptClicked: () => dispatch(actions.modalAcceptClicked()),
    updateWeb3State: (newWeb3State: Web3State) => dispatch(actions.updateWeb3State(newWeb3State)),
    updateMessage: (newMessage: MessageKind) => dispatch(actions.updateMessage(newMessage)),

    onSendingHashToEthereum:
      (payload: { messageKind: MessageKind, isSpinnerNeeded: boolean }) =>
        dispatch(actions.onSendingHashToEthereum(payload)),
    onSavedHashToEthereum:
      (payload: { messageKind: MessageKind, isSpinnerNeeded: boolean, savedHash: string }) =>
        dispatch(actions.onSavedHashToEthereum(payload)),
  };
}

function mapStateToProps(state: StoreState) {
  return {
    formState: state.formState,
    isMetamaskDialogVisible: state.isMetamaskDialogVisible,
    isSpinnerNeeded: state.isSpinnerNeeded,
    web3State: state.web3State,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
