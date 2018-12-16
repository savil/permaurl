var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var PermaURLStorage = artifacts.require("./PermaURLStorage.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(PermaURLStorage);
};
