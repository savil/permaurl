import React, { Component } from "react";

import "./ModalDialog.css"

interface ModalDialogState {
  isVisible: boolean
}

interface ModalDialogProps {
  isVisible: boolean;
  onAcceptButtonClicked(): void;
  dialogShouldClose(): void;
}

// inspiration from: https://github.com/marcio/react-skylight
class ModalDialog extends Component<ModalDialogProps, ModalDialogState> {
  state = {
    isVisible: this.props.isVisible
  };

  componentWillReceiveProps(nextProps: ModalDialogProps) {
    if (nextProps.isVisible !== this.props.isVisible) {
      this.setState({isVisible: nextProps.isVisible});
    }
  }

  render() {
    const overlayStyle = {
      display: this.state.isVisible ? "block" : "none"
    }

    return (
      <div
        className="ModalDialogOverlay"
        onClick={this.onOverlayClicked.bind(this)}
        style={overlayStyle}
        >
        <div className="ModalDialogContainer">
          <div>
          {this.props.children}
          </div>
          <button
            className="Accept"
            onClick={this.onAcceptButtonClicked.bind(this)}>
            Sounds good
          </button>
          <button onClick={this.onCancelButtonClicked.bind(this)}>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  onOverlayClicked(e: React.SyntheticEvent) {
    this.closeDialog(e);
  }

  onCancelButtonClicked(e: React.SyntheticEvent) {
    this.closeDialog(e);
  }

  onAcceptButtonClicked(e: React.SyntheticEvent) {
    this.closeDialog(e);
    this.props.onAcceptButtonClicked();
  }

  closeDialog(e: React.SyntheticEvent) {
    e.preventDefault();
    this.props.dialogShouldClose();
  }
}

export default ModalDialog;
