(async function run(contract) {
	let tx = getTxById(
		"353dec0898ba7b496475902add3631ba17877b66e793eb46fe771709c22e47a1"
	);
	return [
		{ type: "ModifyState", attributes: [{ key: "hey", value: "world" }] },
	];
});

function hello() {
	return "hello world";
}
