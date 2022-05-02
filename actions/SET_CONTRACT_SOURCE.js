const fetch = require("cross-fetch");
let vm = require("vm-browserify");
module.exports = async function (contract, params) {
	let Buffer = require("buffer").Buffer;
	let { tx, author, txRaw } = params;
	if (author != contract.contractAddress) {
		throw new Error(
			"Only the contract owner can set contract source. To change the contract code, you should submit transactions from contract's address. Alternatively you can change it directly from code."
		);
	} else {
		let codeSrc = Buffer.from(tx.body.memo.split(":")[2], "base64").toString(
			"utf8"
		);

		if (!codeSrc || codeSrc.length == 0) {
			throw new Error("Invalid contract source.");
		}
		contract.source = codeSrc;
		contract.sourceCode = await fetch(codeSrc).then((res) => res.text());
		// console.log(contract.sourceCode);
		// console.log("Set contract code to " + contract.source);
	}
};
