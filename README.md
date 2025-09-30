# Interop Messages Defi Demo

This repo contains smart contracts and a frontend to test sending and verifying interop messages.
It demonstrates a defi-based use case for interop messages using [ZKsync Connect](https://docs.zksync.io/zksync-network/unique-features/zksync-connect).

## Environment Setup

Follow the instructions in the [ZKsync docs](https://docs.zksync.io/zk-stack/running/gateway-settlement-layer) to setup a multichain environment with a gateway chain and 3 other chains migrated to gateway.

## Contracts

There are two smart contracts: `Staking.sol` and `InteropToken.sol`.

The staking contract allows anyone to deposit and withdraw funds.
On the first deposit, the user's address is encoded and sent as a message.

The token contract allows users to mint some tokens if they can verify that they have previously deposited any value using one of the approved staking contracts.
The approved staking contract addresses are defined in the constructor function.
Users can only call the mint function once.

### Install Dependencies

```bash
cd contracts
bun install
```

### Setup the keystore

Setup the config variables used in the Hardhat config using the `hardhat keystore` command.

```bash
bun hardhat keystore set WALLET_PRIVATE_KEY
```

For a local zkstack chain, you can set this to `0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110`.
Make sure this address has some funds on each network (except Gateway).
You can send funds to the wallet using the `zkstack dev rich-account` command:

```bash
zkstack dev rich-account --chain zk_chain_1
```

Then set the RPC urls for three chains plus ZKsync Gateway in `hardhat.config.ts`.
For local zkstack chains, you can find these values at `<YOUR_ECOSYSTEM>/chain/<CHAIN_NAME>/configs/general.yaml`.

### Deploying the Contracts

First compile the contracts with:

```bash
bun compile
```

Then deploy the staking contract to the staking chains:

```bash
bun deploy:staking --network stakingChain1
```

```bash
bun deploy:staking --network stakingChain2
```

### Deploy the Token Contract

Update the approved staking contract addresses and chain IDs in the `ignition/modules/InteropToken.ts`.

Then deploy the `InteropToken` contract:

```bash
bun deploy:token
```

### Running the test

In `scripts/interop-test.ts` update the deployed leaderboard address.

Then test that everything works by running the script:

```bash
bun interop
```

You should see an output similar to this:

```bash
TX HASH 0x...
status QUEUED
status PROVING
status EXECUTED
interop root is updated 0x...
canVerify true
tokenBalance 1n
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

You can send funds to your wallet using the `zkstack dev rich-account` command:

```bash
zkstack dev rich-account --chain zk_chain_1 0x<YOUR_WALLET_ADDRESS>
```

Now you can test the staking and tokens contracts with the frontend.
On a staking chain, deposit some amount and then copy your transaction hash.
On the rewards chain, input the transaction hash and select the staking chain you used.
Then click the mint button to mint a token.
