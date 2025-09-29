# Interop Messages Defi Demo

This repo contains smart contracts and a frontend to test sending and verifying interop messages.

## Contracts

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

You should see the winning chain switch from the ID of the first game chain to the ID of the second game chain.

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

In your browser wallet import the account that we used for testing.
The private key for this can be found in any of the `contracts/scripts` files.

On the frontend, you should be able to add each network to your wallet by clicking on them.

Now you can test the game with the frontend.
On a game chain, increment your score, then copy your transaction ID.
On the leaderboard chain, input the transaction ID and your score, then submit them to prove the score on the leaderboard chain.
