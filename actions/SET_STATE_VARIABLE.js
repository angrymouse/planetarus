module.exports = async function (contract, params) {
	let Buffer = require("buffer").Buffer;
	let { tx, author, txRaw } = params;
	if (author != contract.contractAddress) {
		throw new Error(
			"Only the contract owner can set state variables. To change the contract state variable avoiding source code, you should submit transactions from contract's address."
		);
	} else {
		let key = Buffer.from(tx.body.memo.split(":")[2], "base64").toString(
			"utf8"
		);
		let value = Buffer.from(tx.body.memo.split(":")[3], "base64").toString(
			"utf8"
		);
		if (!value || value.length == 0) {
			delete contract.state[key];
		} else {
			contract.state[key] = value;
		}
	}
};
