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

	it("...should throw error, because calling set() twice on same key", async () => {
		const instance = await PermaURLStorage.deployed();

		const hashedURL = "aab";
		const fullURL = "http://localhost:3030/foo/bar";
		await instance.set(hashedURL, fullURL, { from: accounts[0] } );

		// do it again!
		var error = null;
		try {
			await instance.set(hashedURL, fullURL, { from: accounts[0] } );
		} catch (err) {
			error = err;
		}
		assert.notEqual(error, null, "expect error to be caught");
		console.log(error);
	});

	it("...get empty data, because calling get() without set()", async () => {
		const instance = await PermaURLStorage.deployed();

		const hashedURL = "abc";
		const rawData = await instance.get.call(hashedURL);

		assert.equal(rawData, '0x', "rawData should be 0x0, but got: " + rawData);
	});
});
