pragma solidity ^0.4.24;

contract PermaURLStorage {

	mapping(bytes32 => string) private hashToFullURL;

	function set(string fullURL) public returns (bytes32) {
		bytes32 hashed = keccak256(fullURL);
		hashToFullURL[hashed] = fullURL;
	}
}
