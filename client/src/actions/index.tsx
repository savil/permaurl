import * as constants from "../constants";
import { MessageKind, Web3State } from "../types";

// Style note:
// since all actions have the type attribute, it is specified on top
// then the rest of the attributes are in alphabetical order

export interface FullURLChangedAction {
  type: string,
  text: string,
}
export function fullURLChanged(newFullURL: string): FullURLChangedAction {
  return { type: constants.FULL_URL_CHANGED, text: newFullURL };
}

export interface ModalAcceptClicked {
  type: string
}
export function modalAcceptClicked(): ModalAcceptClicked {
  return { type: constants.MODAL_ACCEPT_PRESSED };
}

export interface ModalCancelClicked {
  type: string
}
export function modalCancelClicked(): ModalCancelClicked {
  return { type: constants.MODAL_CANCEL_PRESSED };
}

export interface ShowMetamaskDialog {
  type: string
}
export function showMetamaskDialog(): ShowMetamaskDialog {
  return { type: constants.SHOW_METAMASK_DIALOG };
}

export interface UpdateWeb3StateAction {
  type: string,
  web3State: Web3State,
}
export function updateWeb3State(newWeb3State: Web3State): UpdateWeb3StateAction {
  return { type: constants.UPDATE_WEB3_STATE, web3State: newWeb3State };
}

export interface UpdateMessageAction {
  type: string,
  kind: MessageKind,
}
export function updateMessage(messageKind: MessageKind): UpdateMessageAction {
  return { type: constants.UPDATE_MESSAGE, kind: messageKind };
}

export interface OnHashInputChangeAction {
  type: string,
  payload: {
    customHash: string,
    customHashTimeoutID: ReturnType<typeof setTimeout> | undefined,
    isSpinnerNeeded: boolean,
    isSubmitEnabled: boolean,
    messageKind: MessageKind,
  }
}
export function onHashInputChange(
  payload: {
    customHash: string,
    customHashTimeoutID: ReturnType<typeof setTimeout> | undefined,
    isSpinnerNeeded: boolean,
    isSubmitEnabled: boolean,
    messageKind: MessageKind,
  }
): OnHashInputChangeAction {
  return {
    type: constants.ON_HASH_INPUT_CHANGE,
    payload: payload,
  }
}

export interface OnCustomHashCheckIsResolvedAction {
  type: string,
  payload: {
    customHash: string,
    customHashTimeoutID: ReturnType<typeof setTimeout> | undefined,
    isSpinnerNeeded: boolean,
    isSubmitEnabled: boolean,
    messageKind: MessageKind,
  }
}
export function onCustomHashCheckIsResolved(
  payload: {
    customHash: string,
    customHashTimeoutID: ReturnType<typeof setTimeout> | undefined,
    isSpinnerNeeded: boolean,
    isSubmitEnabled: boolean,
    messageKind: MessageKind,
  }
): OnCustomHashCheckIsResolvedAction {
  return {
    type: constants.ON_CUSTOM_HASH_CHECK_IS_RESOLVED,
    payload: payload,
  }
}

export interface OnSendingHashToEthereumAction {
  type: string,
  payload: {
    isSpinnerNeeded: boolean,
    messageKind: MessageKind,
  }
}
export function onSendingHashToEthereum(
  payload: {
    isSpinnerNeeded: boolean,
    messageKind: MessageKind,
  }
): OnSendingHashToEthereumAction {
  return {
    type: constants.ON_SENDING_HASH_TO_ETHEREUM,
    payload: payload,
  }
}

export interface OnSavedHashToEthereumAction {
  type: string,
  payload: {
    isSpinnerNeeded: boolean,
    messageKind: MessageKind,
    savedHash: string,
  }
}
export function onSavedHashToEthereum(
  payload: {
    isSpinnerNeeded: boolean,
    messageKind: MessageKind,
    savedHash: string,
  }
): OnSavedHashToEthereumAction {
  return {
    type: constants.ON_SAVED_HASH_TO_ETHEREUM,
    payload: payload
  }
}

export type PermaURLAction =
  FullURLChangedAction |
  ModalAcceptClicked |
  ModalCancelClicked |
  OnCustomHashCheckIsResolvedAction |
  OnHashInputChangeAction |
  OnSavedHashToEthereumAction |
  OnSendingHashToEthereumAction |
  ShowMetamaskDialog |
  UpdateMessageAction |
  UpdateWeb3StateAction;
