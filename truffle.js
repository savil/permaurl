require("dotenv").config();

const path = require("path");
const HDWalletProvider = require("truffle-hdwallet-provider");

// from https://iancoleman.io/bip39/

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),

  networks : {
    development: {
      host: "localhost",
      port: 7545,
      network_id: "*" // any
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(process.env.MNEMONIC, "https://ropsten.infura.io/v3/" + process.env.INFURA_PROJECT_ID)
      },
      network_id: 3
    },
		mainnet: {
      provider: function() {
        return new HDWalletProvider(process.env.MNEMONIC, "https://mainnet.infura.io/v3/" + process.env.INFURA_PROJECT_ID)
      },
      network_id: 1,
      gas: 1000000, // remix.ethereum.org
      gasPrice: 200000000, // 1.2 GWei https://ethgasstation.info/
    }
	}
};
