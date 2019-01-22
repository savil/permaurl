import React, { Component } from "react";
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import * as actions from "../actions/";
import { copyToClipboard } from "../utils/clipboard";
import { getHashedURL } from "../utils/Host";
import { BackingStore, MessageKind, StoreState } from "../types";

interface MessageProps {
  backingStore: BackingStore,
  customHash: string,
  messageKind: MessageKind,
  savedHash: string | null,
}

interface MessageState {
}

class Message extends Component<MessageProps, MessageState> {
  render() {
    return (
		  <div className="Message-container"> {this.getMessageInternals()} </div>
    );
  }

  getMessageInternals() {
    switch (this.props.messageKind) {
      case MessageKind.CHECKING_AVAILABILITY:
        return (<p> checking if /{this.props.customHash} is available.</p>);

      case MessageKind.HASH_TAKEN_TRY_ANOTHER:
        return (<p>/{this.props.customHash} has already been taken. Please try another one.</p>);

      case MessageKind.SHORT_URL_PREVIEW:
        return (
          <p>
            your shortened url will be:
            <br />
            {getHashedURL(this.props.customHash, this.props.backingStore)}
            <br />
          </p>
        );

      case MessageKind.EMPTY_URL:
        return (<p>yo! please enter a full url in the box.</p>);

      case MessageKind.INSTALL_METAMASK:
        return (
            <p>
              Alas, looks like you will need to
              install <a href="https://metamask.io" rel="noopener noreferrer" target="_blank">Metamask</a>.
              This lets us save your URL securely.
            </p>
          );

      case MessageKind.SENDING_TO_ETHEREUM:
        return (<p>Alrighty, saving on ethereum. Will take around 20 seconds. {getEncouragement()}</p>);

      case MessageKind.HASHED_URL_WITH_COPY:
        const resultHashedURL = this.props.savedHash === null ? '' : getHashedURL(this.props.savedHash, this.props.backingStore);
        return (
          <p>
            {resultHashedURL}
            &nbsp; &nbsp; &nbsp; &nbsp; (
            <a
              className="App-link"
              onClick={() => copyToClipboard(resultHashedURL)}
              >
              copy
            </a>
            {')'}
          </p>
        );

      case MessageKind.FAILED_TO_GENERATE_HASH:
        return (<p>"Failed to generate a suitable hash! Bummer."</p>);

      case MessageKind.ERROR_SENDING_TO_ETHEREUM:
        return (<p>"There was an error saving on ethereum. Sad puppy :-("</p>);

      case MessageKind.NONE:
      default:
        return null;
    }
  }
}

function getEncouragement(): string {
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

function mapStateToProps(state: StoreState) {
  return {
    backingStore: state.optionsState.backingStore,
    customHash: state.formState.customHash,
    savedHash: state.savedHash,
    messageKind: state.messageKind,
  };
}

function mapDispatchToProps(dispatch: Dispatch<actions.PermaURLAction>) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Message);
