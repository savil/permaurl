import * as constants from "../constants";

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

export type PermaURLAction =
  FullURLChangedAction |
  ModalAcceptClicked |
  ModalCancelClicked |
  ShowMetamaskDialog;
