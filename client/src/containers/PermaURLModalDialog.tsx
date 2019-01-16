import React, { Component} from 'react';
import { connect } from 'react-redux';

import ModalDialog from "./../ModalDialog"

interface PermaURLModalDialogProps {
  isVisible: boolean,
  onAcceptButtonClicked: () => void,
  onDialogShouldClose: () => void
}

class PermaURLModalDialog extends Component<PermaURLModalDialogProps, {}> {
  render() {
    return (
      <ModalDialog
        isVisible={this.props.isVisible}
        onAcceptButtonClicked={this.props.onAcceptButtonClicked}
        dialogShouldClose={this.props.onDialogShouldClose}
      >
        Next, Metamask will open a dialog.
        <br />
        <br />
        You will be asked to confirm the transaction for saving your URL to ethereum's blockchain.
        <br />
        <br />
      </ModalDialog>
    );
  };
}

export default connect()(PermaURLModalDialog);
