let { Network, Contract } = require("../index.js");
(async () => {
	let network = new Network("sif", "wss://rpc.sifchain.finance");
	await network.connect();
	let contract = new Contract(
		network,
		"sif15tnqdg7kfh3at0rfzykf0ud0f7jx4j3qs0juae",
		false
	);
	await contract.ensureSyncing();
	console.log(contract.state);
	console.log(contract.meta);
	// network._tendermintClient.disconnect();
})();
