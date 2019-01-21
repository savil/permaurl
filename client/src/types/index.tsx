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

export enum MessageKind {
  CHECKING_AVAILABILITY = 'CHECKING_AVAILABILITY',
  EMPTY_URL = 'EMPTY_URL',
  ERROR_SENDING_TO_ETHEREUM = 'ERROR_SENDING_TO_ETHEREUM',
  FAILED_TO_GENERATE_HASH = 'FAILED_TO_GENERATE_HASH',
  INSTALL_METAMASK= 'INSTALL_METAMASK',
  HASH_TAKEN_TRY_ANOTHER = 'HASH_TAKEN_TRY_ANOTHER',
  HASHED_URL_WITH_COPY = 'HASHED_URL_WITH_COPY',
  NONE = 'NONE',
  SENDING_TO_ETHEREUM = 'SENDING_TO_ETHEREUM',
  SHORT_URL_PREVIEW = 'SHORT_URL_PREVIEW',
}

export interface FormState {
  customHash: string,
  fullURL: string,
  isSubmitEnabled: boolean,
  customHashTimeoutID: ReturnType<typeof setTimeout> | undefined,
}

export const initFormState: FormState = {
  customHash: '',
  fullURL: '',
  isSubmitEnabled: true,
  customHashTimeoutID: undefined,
}

export enum BackingStore {
  MAINNET = 'MAINNET',
  ROPSTEN = 'ROPSTEN',
}

export interface OptionsState {
  isVisible: boolean
  backingStore: BackingStore,
}

export const initOptionsState: OptionsState = {
  isVisible: false,
  backingStore: BackingStore.ROPSTEN,
}

export interface StoreState {
  formState: FormState,
  isMetamaskDialogVisible: boolean,
  isSpinnerNeeded: boolean,
  messageKind: MessageKind,
  optionsState: OptionsState,
  savedHash: string | null,
  web3State: Web3State,
}

export const initialState: StoreState = {
  formState: initFormState,
  isMetamaskDialogVisible: false,
  isSpinnerNeeded: false,
  messageKind: MessageKind.NONE,
  optionsState: initOptionsState,
  savedHash: null,
  web3State: initWeb3State,
}
