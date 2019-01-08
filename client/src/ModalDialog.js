import React, { Component } from "react";

import "./ModalDialog.css"

// inspiration from: https://github.com/marcio/react-skylight
class ModalDialog extends Component {
  state = {
    isVisible: this.props.isVisible
  };

  componentWillReceiveProps(nextProps) {
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

  onOverlayClicked(e) {
    this.closeDialog(e);
  }

  onCancelButtonClicked(e) {
    this.closeDialog(e);
  }

  onAcceptButtonClicked(e) {
    this.closeDialog(e);
    this.props.onAcceptButtonClicked();
  }

  closeDialog(e) {
    e.preventDefault();
    this.props.dialogShouldClose();
  }
}

export default ModalDialog;
