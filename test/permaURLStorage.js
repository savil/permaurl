const PermaURLStorage = artifacts.require("./PermaURLStorage.sol");

contract("PermaURLStorage", accounts => {
	it("...should store localhost:3030", async () => {
		const instance = await PermaURLStorage.deployed();

		const hashedURL = "aaa";
		const fullURL = "http://localhost:3030/foo/bar";
		await instance.set(hashedURL, fullURL, { from: accounts[0] } );

		const rawData = await instance.get.call(hashedURL);
		const storedData = web3.toAscii(rawData);

		assert.equal(
			storedData,
			fullURL,
			"the value " + fullURL + " was not stored. Instead, got: " + storedData
		);
	});
});
