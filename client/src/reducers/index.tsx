import { combineReducers } from 'redux';

import * as actions from "../actions/"
import * as constants from "../constants";
import {
  FormState,
  initFormState,
  initialState,
  initWeb3State,
  MessageKind,
  StoreState,
  Web3State,
} from "../types/";

function isMetamaskDialogVisible(
  state: boolean | undefined = false,
  action: actions.PermaURLAction,
): boolean {
  switch (action.type) {
    case constants.MODAL_ACCEPT_PRESSED:
    case constants.MODAL_CANCEL_PRESSED:
      return false;
    case constants.SHOW_METAMASK_DIALOG:
      return true;
    default:
      return state;
  }
}

function web3State(
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

function messageKind(
  state: MessageKind | undefined = MessageKind.NONE,
  action: actions.PermaURLAction,
): MessageKind {
  switch (action.type) {
    case constants.ON_HASH_INPUT_CHANGE:
      return (action as actions.OnHashInputChangeAction).payload.messageKind;
    case constants.ON_CUSTOM_HASH_CHECK_IS_RESOLVED:
      return (action as actions.OnCustomHashCheckIsResolvedAction).payload.messageKind;
    case constants.ON_SAVED_HASH_TO_ETHEREUM:
      return (action as actions.OnSavedHashToEthereumAction).payload.messageKind;
    case constants.ON_SENDING_HASH_TO_ETHEREUM:
      return (action as actions.OnSendingHashToEthereumAction).payload.messageKind;
    case constants.UPDATE_MESSAGE:
      return (action as actions.UpdateMessageAction).kind;
    default:
      return state;
  }
}

function formState(
  state: FormState | undefined = initFormState,
  action: actions.PermaURLAction,
): FormState {
  switch (action.type) {
    case constants.FULL_URL_CHANGED:
      return {
        ...state,
        fullURL: (action as actions.FullURLChangedAction).text,
      };
    case constants.ON_HASH_INPUT_CHANGE:
      let action2 = action as actions.OnHashInputChangeAction;
      return {
        ...state,
        customHashTimeoutID: action2.payload.customHashTimeoutID,
        customHash: action2.payload.customHash,
        isSubmitEnabled: action2.payload.isSubmitEnabled,
      };
    case constants.ON_CUSTOM_HASH_CHECK_IS_RESOLVED:
      let actn = action as actions.OnCustomHashCheckIsResolvedAction;
      return {
        ...state,
        customHash: actn.payload.customHash,
        customHashTimeoutID: actn.payload.customHashTimeoutID,
        isSubmitEnabled: actn.payload.isSubmitEnabled,
      };
    default:
      return state;
  }
}

function savedHash(
  state: string | null | undefined = null,
  action: actions.PermaURLAction,
): string | null {
  switch (action.type) {
    case constants.ON_SAVED_HASH_TO_ETHEREUM:
      return (action as actions.OnSavedHashToEthereumAction).payload.savedHash;
    default:
      return state;
  }
}

function isSpinnerNeeded(
  state: boolean | undefined = false,
  action: actions.PermaURLAction,
): boolean {
  switch (action.type) {
    case constants.ON_HASH_INPUT_CHANGE:
      return (action as actions.OnHashInputChangeAction).payload.isSpinnerNeeded;
    case constants.ON_CUSTOM_HASH_CHECK_IS_RESOLVED:
      return (action as actions.OnCustomHashCheckIsResolvedAction).payload.isSpinnerNeeded;
    case constants.ON_SAVED_HASH_TO_ETHEREUM:
      return (action as actions.OnSavedHashToEthereumAction).payload.isSpinnerNeeded;
    case constants.ON_SENDING_HASH_TO_ETHEREUM:
      return (action as actions.OnSendingHashToEthereumAction).payload.isSpinnerNeeded;
    default:
      return state;
  }
}

export const permaURLAppReducers = combineReducers({
  formState: formState,
  isMetamaskDialogVisible: isMetamaskDialogVisible,
  isSpinnerNeeded: isSpinnerNeeded,
  messageKind: messageKind,
  savedHash: savedHash,
  web3State: web3State,
});
