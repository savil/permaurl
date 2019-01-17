import truffleContract from "truffle-contract";

import { Mode } from "./mode";
import { Web3State } from "../types";
import { getWeb3Async, getWeb3ReadOnlyAsync } from "./getWeb3";
import PermaURLStorageContract from "../contracts/PermaURLStorage.json";

//const MODE = Mode.MAINNET;
const MODE = Mode.ROPSTEN;

export const Permissions = {
  READ_ONLY: "read_only",
  READ_WRITE: "read_write"
};

const ContractAddress = {
  MAINNET_ADDRESS: "0xf0625cF19647fe7689Bc7b0B8C54aFFb71d94cb3",
  ROPSTEN_ADDRESS: "0x0c72eb3f9ad6c762c17adae11ffd2458ce533ef4"
};

export async function getFullURLFromHash(hash: string): Promise<string | null> {
  const components = await getWeb3Components(Permissions.READ_ONLY);
  if (components === null) {
    return null;
  }

  const fullURLRaw = await components.contract.get.call(
    components.web3.utils.asciiToHex(hash)
  );
  if (fullURLRaw === null) {
    return null;
  }
  return components.web3.utils.toAscii(fullURLRaw);
}

export async function getWeb3Components(permissions: string): Promise<Web3State> {
  try {
    // Get network provider and web3 instance.
    const web3 = (permissions === Permissions.READ_ONLY)
      ? await getWeb3ReadOnlyAsync(MODE)
      : await getWeb3Async(MODE);

    // Use web3 to get the user's accounts.
    let accounts = null;
    if (permissions === Permissions.READ_WRITE) {
      accounts = await web3.eth.getAccounts();
    }

    // Get the contract instance.
    const Contract = truffleContract(PermaURLStorageContract);
    Contract.setProvider(web3.currentProvider);

    let instance = null;
    if (MODE === Mode.MAINNET) {
      instance = await Contract.at(ContractAddress.MAINNET_ADDRESS);
    } else {
      instance = await Contract.at(ContractAddress.ROPSTEN_ADDRESS);
    }

    return { web3, accounts, contract : instance };

  } catch (error) {
    // Catch any errors for any of the above operations.
    console.log(error);
    throw error;
  }
}
