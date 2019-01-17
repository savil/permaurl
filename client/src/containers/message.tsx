import React, { Component } from "react";
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import * as actions from "../actions/";
import { copyToClipboard } from "../utils/clipboard";
import { MessageKind, StoreState } from "../types";
import { getHashedURL } from "../utils/Host";

interface MessageProps {
  customHash: string,
  savedHash: string | null,
  messageKind: MessageKind,
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
        return "checking if /" + this.props.customHash + " is available.";

      case MessageKind.HASH_TAKEN_TRY_ANOTHER:
        return "/" + this.props.customHash + " has already been taken. Please try another one.";

      case MessageKind.SHORT_URL_PREVIEW:
        return (
          <p>
            your shortened url will be:
            <br />
            {getHashedURL(this.props.customHash)}
            <br />
          </p>
        );

      case MessageKind.EMPTY_URL:
        return 'yo! please enter a full url in the box.';

      case MessageKind.INSTALL_METAMASK:
        return (
            <p>
              Alas, looks like you will need to
              install <a href="https://metamask.io" rel="noopener noreferrer" target="_blank">Metamask</a>.
              This lets us save your URL securely.
            </p>
          );

      case MessageKind.SENDING_TO_ETHEREUM:
        return "Alrighty, saving on ethereum. Will take around 20 seconds. " + getEncouragement();

      case MessageKind.HASHED_URL_WITH_COPY:
        const resultHashedURL = this.props.savedHash === null ? '' : getHashedURL(this.props.savedHash);
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
        return "Failed to generate a suitable hash! Bummer.";
      case MessageKind.ERROR_SENDING_TO_ETHEREUM:
        return "There was an error saving on ethereum. Sad puppy :-(";
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
    customHash: state.formState.customHash,
    savedHash: state.savedHash,
    messageKind: state.messageKind,
  };
}

function mapDispatchToProps(dispatch: Dispatch<actions.PermaURLAction>) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Message);
