# Interop Messages Defi Demo

This repo contains smart contracts and a frontend to test sending and verifying interop messages.
It demonstrates a defi-based use case for interop messages using [ZKsync Connect](https://docs.zksync.io/zksync-network/unique-features/zksync-connect).

## Contracts

There are two smart contracts: `Staking.sol` and `InteropToken.sol`.

The staking contract allows anyone to deposit and withdraw funds.
On the first deposit, the user's address is encoded and sent as a message.

The token contract allows users to mint some tokens if they can verify that they have previously deposited any value using one of the approved staking contracts.
The approved staking contract addresses are defined in the constructor function.
Users can only call the mint function once.
The token contract will also track the number of mints for each chain.

### Install Dependencies

```bash
cd contracts
bun install
```

### Setup the keystore

Setup the config variables used in the Hardhat config using the `hardhat keystore` command.

```bash
bun hardhat keystore set <WALLET_PRIVATE_KEY>
```

Change the name of the keystores depending on the networks configured in `hardhat.config.ts`.
Make sure you have testnet funds for each chain.
The chains must settle via ZKsync Gateway in order for the contracts to work.

### Deploying the Contracts

First compile the contracts with:

```bash
bun compile
```

Then deploy the staking contract to the staking chains:

```bash
bun deploy:abstract
```

```bash
bun deploy:lens
```

```bash
bun deploy:sophon
```

### Deploy the Token Contract

Update the approved staking contract addresses and chain IDs in the `ignition/modules/InteropToken.ts`.

Then deploy the `InteropToken` contract:

```bash
bun deploy:token
```

## Running the frontend

Move out of the `contracts` folder and into the `frontend` folder.
Then install the dependencies:

```bash
cd ../frontend
bun install
```

### Edit the Chain and Contract Info

In `frontend/utils/constants.ts` edit the values as needed.
In `frontend/utils/wagmi.ts` edit the chain configurations with the correct RPC endpoints and chain IDs.

### Run the frontend

Run the frontend:

```bash
bun dev
```

### Testing the frontend

Open the frontend at [`http://localhost:5173/`](http://localhost:5173/).

On the frontend, you should be able to add each network to your wallet by clicking on them.

Now you can test the staking and tokens contracts with the frontend.
On a staking chain, deposit some amount and then copy your transaction hash.
On the rewards chain, input the transaction hash and select the staking chain you used.
Then click the mint button to mint a token.
