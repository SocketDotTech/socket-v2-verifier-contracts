# Hardhat Template [![Github Actions][gha-badge]][gha] [![Hardhat][hardhat-badge]][hardhat]

[gha]: https://github.com/SocketDotTech/socket-v2-verifier-contracts/actions
[gha-badge]: https://github.com/SocketDotTech/socket-v2-verifier-contracts/actions/workflows/ci.yml/badge.svg
[hardhat]: https://hardhat.org/
[hardhat-badge]: https://img.shields.io/badge/Built%20with-Hardhat-FFDB1C.svg
[license]: https://opensource.org/licenses/MIT
[license-badge]: https://img.shields.io/badge/License-MIT-blue.svg

## Usage

### Compile

Compile the smart contracts with Hardhat:

```sh
$ yarn compile
```

### TypeChain

Compile the smart contracts and generate TypeChain bindings:

```sh
$ yarn typechain
```

### Test

Run the tests with Hardhat:

```sh
$ yarn test
```

### Lint Solidity

Lint the Solidity code:

```sh
$ yarn lint:sol
```

### Lint TypeScript

Lint the TypeScript code:

```sh
$ yarn lint:ts
```

### Coverage

Generate the code coverage report:

```sh
$ yarn coverage
```

### Report Gas

See the gas usage per unit test and average gas per method call:

```sh
$ REPORT_GAS=true yarn test
```

### Clean

Delete the smart contract artifacts, the coverage reports and the Hardhat cache:

```sh
$ yarn clean
```

### Deploy

Deploy the contracts to Hardhat Network:

```sh
$ yarn deploy"
```

## Production

Having to set mnemonics and api keys to develop locally is unnecessary so the template was modified to only require these for deploying and testing on live networks.

To deploy to live networks, make sure to set `MNEMONIC` and `INFURA_API_KEY` and `NODE_ENV="production"`, via env variables or `.env` file. Example available in [.env.example](./.env.example)
