export interface Web3State {
  accounts: null | any,
  contract: null | any,
  web3: null | any,
}

export const initWeb3State: Web3State = {
  accounts: null,
  contract: null,
  web3 : null,
}

export interface StoreState {
  fullURL: string,
  isMetamaskDialogVisible: boolean,
  web3State: Web3State,
}

export const initialState: StoreState = {
  fullURL: '',
  isMetamaskDialogVisible: false,
  web3State: initWeb3State,
}
