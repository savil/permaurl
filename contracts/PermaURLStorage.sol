pragma solidity ^0.4.24;

contract PermaURLStorage {

	mapping(bytes32 => bytes) private hashToFullURL;

	function set(bytes32 hashedURL, bytes fullURL) public {
		// callers should first invoke get(hashedURL) to ensure
		// this key is not already present
		require(
			// TODO savil. More efficient check for this?
			hashToFullURL[hashedURL].length == 0,
			"hashedURL is already present, please call .get(hashedURL) to check first"
		);

		hashToFullURL[hashedURL] = fullURL;
	}

  function get(bytes32 hashedURL) public view returns (bytes) {
		// TODO return null if missing
		return hashToFullURL[hashedURL];
	}
}
