const {
	Tendermint34Client,
	pubkeyToAddress,
	rawSecp256k1PubkeyToRawAddress,
} = require("@cosmjs/tendermint-rpc");
class Network {
	constructor(prefix, rpc, rpcType = "ws") {
		this.networkPrefix = prefix;
		this.rpc = rpc;
		this.rpcType = rpcType;
		this.connected = false;
		this._tendermintClient = null;
	}
	async connect() {
		this._tendermintClient = await Tendermint34Client.connect(this.rpc);
		this.connected = true;

		return this;
	}
}
module.exports = Network;
