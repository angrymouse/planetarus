const { decodeTxRaw, decodePubkey } = require("@cosmjs/proto-signing");
const { toBech32, fromHex } = require("@cosmjs/encoding");
const { pubkeyToAddress } = require("@cosmjs/tendermint-rpc");
module.exports = async (contract, id) => {
	let rawTx = await contract.network._tendermintClient.tx({
		hash: Buffer.from(id, "hex"),
	});
	// console.log(rawTx);
	let tx = decodeTxRaw(rawTx.tx);
	tx.signers = tx.authInfo.signerInfos.map((signerInfo) =>
		toBech32(
			contract.network.networkPrefix,
			fromHex(
				pubkeyToAddress(
					"secp256k1",
					Buffer.from(decodePubkey(signerInfo.publicKey).value, "base64"),
					"base64"
				)
			)
		)
	);
	tx.blockHeight = rawTx.height;
	tx.hash = rawTx.hash;
	tx.gasWanted = rawTx.result.gasWanted;
	tx.gasUsed = rawTx.result.gasUsed;
	let events = rawTx.result.events.map((event) => {
		return {
			type: event.type,
			attributes: event.attributes.map((attribute) => {
				attribute = {
					key: Buffer.from(attribute.key).toString("utf8"),
					value: Buffer.from(attribute.value).toString("utf8"),
				};

				return attribute;
			}),
		};
	});

	let eventsNormalized = events.reduce((acc, event) => {
		return {
			...acc,
			[event.type]: event.attributes.reduce((a, e) => {
				return { ...a, [e.key]: e.value };
			}, {}),
		};
	}, {});
	tx.events = rawTx.result.events;
	tx.eventsNormalized = eventsNormalized;

	return tx;
};
