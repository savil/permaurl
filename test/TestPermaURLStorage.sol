pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/PermaURLStorage.sol";

contract TestPermaURLStorage {
	function testStoringValue() public {
		PermaURLStorage permaURLStorage = PermaURLStorage(DeployedAddresses.PermaURLStorage());

		bytes32 hashedURL = "abc";
		bytes memory fullURL = "http://localhost:3000/foo/bar";
		permaURLStorage.set("abc", fullURL);

		Assert.equal(keccak256(permaURLStorage.get(hashedURL)), keccak256(fullURL), "hashedURL doesn't match fullURL");
	}
}
