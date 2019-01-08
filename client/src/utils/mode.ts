export interface ModeInterface {
  MAINNET: string,
  ROPSTEN: string,
  LOCALHOST: string
}

export const Mode: ModeInterface = {
  MAINNET: "mainnet",
  ROPSTEN: "ropsten",
  LOCALHOST: "localhost"
};

export default Mode;
