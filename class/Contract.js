const {
	Tendermint34Client,
	pubkeyToAddress,
	rawSecp256k1PubkeyToRawAddress,
} = require("@cosmjs/tendermint-rpc");
const {
	decodeTxRaw,
	decodePubkey,
	encodePubkey,
} = require("@cosmjs/proto-signing");
const { toBech32, fromHex } = require("@cosmjs/encoding");
const actionTypes = require("../structures/actionTypes.js");
const { accountFromAny } = require("@cosmjs/stargate");
const { Secp256k1 } = require("@cosmjs/crypto");

class Contract {
	constructor(network, contractAddress, autosync = true) {
		this.network = network;
		this.contractAddress = contractAddress;
		this._tmQuery = `message.module='bank' AND transfer.recipient='${this.contractAddress}' AND tx.height<=9007199254740991 AND tx.height>=6600000`;
		this.synced = false;
		this._syncing = false;
		this.processedInteractions = new Set();
		this.state = {};
		this.meta = {};
		this.source = null;
		if (!network.connected) {
			throw new Error(
				"Network not connected. Ensure network.connect() is called."
			);
		}
		if (autosync) {
			this.ensureSyncing();
		}
	}
	async _syncToCurrentState() {
		this._syncing = true;
		let alreadySentTransactions = (
			await this.network._tendermintClient.txSearchAll({
				query: this._tmQuery,
			})
		).txs;
		for (const tx of alreadySentTransactions) {
			await this.processTx(tx);
		}
		this.network._tendermintClient.subscribeTx(this._tmQuery).addListener({
			next: async (tx) => {
				await this.processTx(tx);
			},
		});
	}
	async ensureSyncing() {
		if (!this.synced && !this._syncing) {
			await this._syncToCurrentState();
		}
	}
	async processTx(txRaw) {
		if (!Buffer) {
			var Buffer = require("buffer").Buffer;
		}

		let tx;
		try {
			tx = decodeTxRaw(txRaw.tx);
			if (!tx.body.memo.startsWith("pl:")) {
				return;
			}
			let author = toBech32(
				this.network.networkPrefix,
				fromHex(
					pubkeyToAddress(
						"secp256k1",
						Buffer.from(
							decodePubkey(tx.authInfo.signerInfos[0].publicKey).value,
							"base64"
						),
						"base64"
					)
				)
			);
			let action = tx.body.memo.split(":")[1];
			if (!action) {
				throw new Error("No action");
			}
			if (actionTypes[action] === undefined) {
				throw new Error("Invalid action");
			}

			await actionTypes[action](this, { tx, author, txRaw });
		} catch (e) {
			console.log(e.message);
			console.error(
				"Interaction failed to verify. Skipping. TX id:" +
					Buffer.from(txRaw.hash).toString("hex")
			);
			return;
		}
	}
	async processAction(action) {}
}
module.exports = Contract;
