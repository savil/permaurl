import { combineReducers } from 'redux';

import * as actions from "../actions/"
import * as constants from "../constants";
import { StoreState, initialState, Web3State, initWeb3State } from "../types/index"

function fullURLChangedReducer(
  fullURL: string | undefined = "",
  action: actions.PermaURLAction,
): string {
  switch (action.type) {
    case constants.FULL_URL_CHANGED:
      return (action as actions.FullURLChangedAction).text;
    default:
      return fullURL;
  }
}

function modalDialogReducer(
  state: boolean | undefined = false,
  action: actions.PermaURLAction,
): boolean {
  switch (action.type) {
    case constants.MODAL_ACCEPT_PRESSED:
      return false;
    case constants.MODAL_CANCEL_PRESSED:
      return false;
    case constants.SHOW_METAMASK_DIALOG:
      return true;
    default:
      return state;
  }
}

function updateWeb3StateReducer(
  state: Web3State | undefined = initWeb3State,
  action: actions.PermaURLAction,
): Web3State {
  switch (action.type) {
    case constants.UPDATE_WEB3_STATE:
      return (action as actions.UpdateWeb3StateAction).web3State;
    default:
      return state;
  }
}

export const permaURLAppReducers = combineReducers({
  fullURL: fullURLChangedReducer,
  isMetamaskDialogVisible: modalDialogReducer,
  web3State: updateWeb3StateReducer,
});
