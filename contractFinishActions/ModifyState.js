module.exports = function (contract, attributes) {
	if (!Array.isArray(attributes)) {
		throw new Error("Invalid attributes.");
	}
	attributes.forEach((attr) => {
		contract.state[attr.key] = attr.value;
	});
};
