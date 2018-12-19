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
        return new HDWalletProvider(process.env.MNEMONIC, "https://ropsten.infura.io/v3/cb7d847147034deab366ab3169602261") //"https://ropsten.infura.io/" + process.env.INFURA_SECRET)
      },
      network_id: 3
    },
		mainnet: {
      provider: function() {
        return new HDWalletProvider(process.env.MNEMONIC, "https://mainnet.infura.io/v3/cb7d847147034deab366ab3169602261")
      },
      network_id: 1
		}
	}
};
