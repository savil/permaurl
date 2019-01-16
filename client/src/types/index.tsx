export interface StoreState {
  fullURL: string,
  isMetamaskDialogVisible: boolean
}

export const initialState: StoreState = {
  fullURL: '',
  isMetamaskDialogVisible: false,
}
