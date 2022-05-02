# Planetarus
Smart contracts for every cosmos chain!

Planetarus is framework for lazy smart contracts. Lazy smart contracts were originally invented in [Arweave](https://github.com/ArweaveTeam/SmartWeave), but they're chain-agnostic, so can be used everywhere, including every cosmos based chain.

It works pretty simple: There's contract code, and set of interactions with this code. Set of interactions can be stored in every reliable place, so in cosmos transactions too.

Planetarus framework uses MEMOs of cosmos transactions as interaction storage.

In Planetarus, to create contract, you should firstly create new wallet: Address of this wallet will be address of your smart contract.

Every transfer to this address witth be interpreted as interaction with contract, and MEMO will be interaction body.

All interactions to contracts should be in this format "pl:<action number>:<action body>" (without quotes).
There's 4 action numbers:

1. Set contract source. As action body you should use link to contract source code, base64 encoded. This transaction should be sent from contract address to same contract address.
2. Set state variable (Avoiding contract source). As action body you should provide key and value in base64 ecoded variant (<base64 key>:<base64 value>). This transaction should be sent from contract address to same contract address.
3. Set contract metadata variable. You can get metadata variable from contract source, but not set. The only way to set metadata variable is to send this transaction. As action body you should provide key and value in base64 ecoded variant (<base64 key>:<base64 value>). This transaction should be sent from contract address to same contract address.
4. Interact with contract (call contract source). As action body you should provide list of arguments to interact with `run()` function, splitted by ":" (without quotes), and encoded in base64 format. These inputs will be decoded to `Buffer` and you will need to convert it to convinient format directly in code.

Example of transaction body: `pl:1:aHR0cHM6Ly9hcndlYXZlLm5ldC9leGFtcGxlLWNvbnRyYWN0LWNvZGUuanM=`

