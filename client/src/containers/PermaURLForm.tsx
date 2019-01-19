import React, { Component } from "react";
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import * as actions from "../actions/";
import { getFullURLFromHash } from "../utils/PermaURLUtil";
import { FormState, MessageKind, StoreState } from "../types";

interface PermaURLFormProps {
  formState: FormState,
  onFullURLChange: (newFullURL: string) => void,
  onHashInputChange:
    (payload: {
      customHash: string,
      customHashTimeoutID: ReturnType<typeof setTimeout> | undefined,
      isSpinnerNeeded: boolean,
      isSubmitEnabled: boolean,
      messageKind: MessageKind,
    }) => void,
  onCustomHashCheckIsResolved:
    (payload: {
      customHash: string,
      customHashTimeoutID: ReturnType<typeof setTimeout> | undefined,
      isSpinnerNeeded: boolean,
      isSubmitEnabled: boolean,
      messageKind: MessageKind,
    }) => void,
  showMetamaskDialog: () => void,
  updateMessage: (newMessage: MessageKind) => void,
}

interface PermaURLFormState {
}

class PermaURLForm extends Component<PermaURLFormProps, PermaURLFormState> {
  render() {
    return (
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
        <input
          disabled={!this.props.formState.isSubmitEnabled}
          className="fullURLSubmit"
          type="submit"
          value="submit"
        />
      </form>
    );
  }

	onFullURLChange(e: React.FormEvent<HTMLInputElement>) {
		e.preventDefault();
    this.props.onFullURLChange(e.currentTarget.value);
	}

	async onSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (this.props.formState.fullURL === '') {
      this.props.updateMessage(MessageKind.EMPTY_URL);
			return;
		}

    this.props.showMetamaskDialog();
  }

  async onHashInputChange(e: React.FormEvent<HTMLInputElement>) {
    e.preventDefault();
    if (this.props.formState.customHashTimeoutID !== undefined) {
      clearTimeout(this.props.formState.customHashTimeoutID);
    }

    const customHash = e.currentTarget.value;
    console.log(customHash, 'customHash');
    if (customHash === '') {
      console.log('cancelling!');
      this.props.onHashInputChange({
        customHash: customHash,
        customHashTimeoutID: undefined,
        isSpinnerNeeded: false,
        isSubmitEnabled: true,
        messageKind: MessageKind.NONE,
      });
      return;
    }

    const timeoutID = setTimeout(
      async () => this.onHashInputChangeImpl(customHash),
      200, // milliseconds
    );
    this.props.onHashInputChange({
      customHash: customHash,
      customHashTimeoutID: timeoutID,
      isSpinnerNeeded: true,
      isSubmitEnabled: false,
      messageKind: MessageKind.CHECKING_AVAILABILITY,
    });
    return;
  }

  async onHashInputChangeImpl(customHash: string) {
    if (this.props.formState.customHashTimeoutID === undefined) {
      return; // abort if already cancelled.
    }

    let isTaken = await isHashTaken(customHash);

    // need to check this again!
    if (this.props.formState.customHashTimeoutID === undefined) {
      return; // abort if already cancelled.
    }

    // check if hash is taken
    // if taken, show message and disable submit
    if (isTaken) {
      this.props.onCustomHashCheckIsResolved({
        customHash: customHash,
        customHashTimeoutID: undefined,
        isSpinnerNeeded: false,
        isSubmitEnabled: false,
        messageKind: MessageKind.HASH_TAKEN_TRY_ANOTHER,
      });
      return;
    }

    // if not taken, then show preview
    this.props.onCustomHashCheckIsResolved({
      customHash: customHash,
      customHashTimeoutID: undefined,
      isSpinnerNeeded: false,
      isSubmitEnabled: true,
      messageKind: MessageKind.SHORT_URL_PREVIEW,
    });
  }
}

export async function isHashTaken(hash: string): Promise<boolean> {
  return (await getFullURLFromHash(hash)) !== null;
}

function mapStateToProps(state: StoreState) {
  console.log('mapping state to props', state.formState);
  return {
    formState: state.formState,
  };
}

function mapDispatchToProps(dispatch: Dispatch<actions.PermaURLAction>) {
  return {

    onCustomHashCheckIsResolved:
      (payload: {
        customHash: string,
        customHashTimeoutID: ReturnType<typeof setTimeout> | undefined,
        isSpinnerNeeded: boolean,
        isSubmitEnabled: boolean,
        messageKind: MessageKind,
      }) => dispatch(actions.onCustomHashCheckIsResolved(payload)),

    onFullURLChange:
      (newFullURL: string) => dispatch(actions.fullURLChanged(newFullURL)),

    onHashInputChange:
      (payload: {
        customHash: string,
        customHashTimeoutID: ReturnType<typeof setTimeout> | undefined,
        isSpinnerNeeded: boolean,
        isSubmitEnabled: boolean,
        messageKind: MessageKind,
      }) => dispatch(actions.onHashInputChange(payload)),

    showMetamaskDialog: () => dispatch(actions.showMetamaskDialog()),
    updateMessage:
      (newMessage: MessageKind) => dispatch(actions.updateMessage(newMessage)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PermaURLForm);
