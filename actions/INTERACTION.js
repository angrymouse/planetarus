const fetch = require("cross-fetch");
let vmb = require("vm-browserify");
let ivm = require("vm2");

module.exports = async function (contract, params) {
	let Buffer = require("buffer").Buffer;
	let { tx, author, txRaw } = params;
	let contractFunctions = require("../contractFramework/_all");
	let contractFinishActions = require("../contractFinishActions/_all");
	if (!contract.source || contract.source.length == 0) {
		throw new Error(
			"Invalid contract source. Set up the contract source before sending any interactions."
		);
	}

	if (typeof window !== "undefined" && typeof window.document !== "undefined") {
		// browser
		let contractRuntime = vm.runInNewContext(contract.sourceCode, {});
		await contractRuntime.run();
	} else {
		const { VM } = require("vm2");

		const vm = new VM({
			timeout: 10000,
			allowAsync: true,
			sandbox: {
				...Object.fromEntries(
					Object.entries(contractFunctions).map((func) => {
						return [
							func[0],
							(...args) => {
								return func[1](contract, ...args);
							},
						];
					})
				),
				caller: author,
				height: txRaw.height,
				currentTxId: tx.id,
			},
		});
		let contractFunction = vm.run(contract.sourceCode, "contract.js");

		let result = await contractFunction();

		if (result == null || result == [] || !Array.isArray(result)) {
			return;
		}
		result.forEach((res) => {
			if (contractFinishActions[res.type]) {
				contractFinishActions[res.type](contract, res.attributes);
			}
		});
	}
};
