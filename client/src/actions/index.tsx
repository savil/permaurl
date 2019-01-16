import * as constants from "../constants";
import { Web3State } from "../types";

export interface FullURLChangedAction {
  type: string,
  text: string,
}
export function fullURLChanged(newFullURL: string): FullURLChangedAction {
  return { type: constants.FULL_URL_CHANGED, text: newFullURL };
}

export interface ModalAcceptClicked { type: string }
export function modalAcceptClicked(): ModalAcceptClicked {
  return { type: constants.MODAL_ACCEPT_PRESSED };
}

export interface ModalCancelClicked { type: string }
export function modalCancelClicked(): ModalCancelClicked {
  return { type: constants.MODAL_CANCEL_PRESSED };
}

export interface ShowMetamaskDialog { type: string }
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

export type PermaURLAction =
  FullURLChangedAction |
  ModalAcceptClicked |
  ModalCancelClicked |
  ShowMetamaskDialog |
  UpdateWeb3StateAction;
