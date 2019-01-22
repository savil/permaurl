import React, { Component } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import * as actions from "../actions/";
import { BackingStore, OptionsState, StoreState } from "../types/";

interface PermaURLOptionsProps {
  optionsState: OptionsState,
  setBackingStore: (newStore: BackingStore) => void,
  setOptionsVisibility: (doShow: boolean) => void,
}

interface PermaURLOptionsState {
}

class PermaURLOptions extends Component<PermaURLOptionsProps, PermaURLOptionsState> {
  render() {
    if (!this.props.optionsState.isVisible) {
      return (
        <div>
          <a onClick={this.doShowOptions.bind(this)}> Show Options </a>
        </div>
      );
    }

    return (
      <div>
        <a onClick={this.doHideOptions.bind(this)}> Hide Options </a>
        <div>
          Storage:
          <select onChange={this.onStorageOptionChange.bind(this)}>
            <option value={BackingStore.MAINNET}>Mainnet (real ethereum) </option>
            <option selected={true} value={BackingStore.ROPSTEN}>Ropsten (fake ethereum, costs nothing to try) </option>
          </select>
        </div>
      </div>
    );
  }

  doShowOptions(e: React.SyntheticEvent) {
    e.preventDefault();
    this.props.setOptionsVisibility(true);
  }

  doHideOptions(e: React.SyntheticEvent) {
    e.preventDefault();
    this.props.setOptionsVisibility(false);
  }

  onStorageOptionChange(e: React.ChangeEvent<HTMLSelectElement>) {
    e.preventDefault();
    this.props.setBackingStore(e.currentTarget.value as BackingStore);
  }
}

function mapDispatchToProps(dispatch: Dispatch<actions.PermaURLAction>) {
  return {
    setOptionsVisibility: (doShow: boolean) => dispatch(actions.setOptionsVisibility(doShow)),
    setBackingStore: (newStore: BackingStore) => dispatch(actions.setBackingStore(newStore)),
  }
}

function mapStateToProps(state: StoreState) {
  return {
    optionsState: state.optionsState,
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PermaURLOptions);
