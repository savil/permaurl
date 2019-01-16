import { combineReducers } from 'redux';

import * as actions from "../actions/"
import * as constants from "../constants";
import { StoreState, initialState } from "../types/index"

function fullURLChangedReducer(fullURL: string | undefined = "", action: actions.PermaURLAction) {
  switch (action.type) {
    case constants.FULL_URL_CHANGED:
      return (action as actions.FullURLChangedAction).text;
    default:
      return fullURL;
  }
}

function modalDialogReducer(state: boolean | undefined = false, action: actions.PermaURLAction) {
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

export const permaURLAppReducers = combineReducers({
  fullURL: fullURLChangedReducer,
  isMetamaskDialogVisible: modalDialogReducer,
});
