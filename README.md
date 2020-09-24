# Jasmine Project Ethereum SDK 
#### Typescript Implementation

## SDK 

SDK wraps the interactions with `TFC` ERC20 Token contract on Ethereum. 
A detailed documentation can be found in [`docs`](https://troublor.github.io/jasmine-eth-ts/)

## Install 

Using npm:
```
npm install jasmine-eth-ts
```

Or using yarn:
```
yarn add jasmine-eth-ts
```

## Usage

Import module:
```typescript
import SDK, {Account, TFC} from "jasmine-eth-ts";
```

The entry point should `SDK` class.
First thing to do is to construct an `SDK` object using an Ethereum endpoint (e.g. local private chain `http://localhost:8545`).
```typescript
let sdk = new SDK("http://localhost:8545");
```

For testing purposes, we provide a `MockEthereum` class which wrapper ganache-core to provide a test environment to use `SDK`. 
Get the predefined accounts (each has 100 Ether) and endpoint:

```typescript
let mockEth = new MockEthereum();
mockEth.predefinedPrivateKeys;
mockEth.endpoint;
```

When using `MockEthereum`, you can create a new TFC ERC20 contract using:
```typescript
let contractAddress = await sdk.deployTFC(initialTokenHolders, creator);
```
`initialTokenHolders` must be an array of length 20 of `Account`s, who will split the initial 2 billion token supply evenly. 

Using the `sdk` object, we can create a new Ethereum account:
```typescript
let account: Account = sdk.createAccount();
```
Or retrieve an existing account using private key:
```typescript
let account: Account = sdk.retrieveAccount(privateKey);
```

We can set a default account for the `sdk` object to interact with Ethereum:
```typescript
sdk.setDefaultAccount(account);
```

Now a `TFC` object can be constructed using its address of contract:
```typescript
let tfc: TFC = sdk.getTFC(contractAddress, account);
```
The second parameter of `getTFC()` is optional, which is the default account for the tfc object to interact with Ethereum. 
If omitted, the default account of `tfc` object will be use the same one as `sdk` object. 

Now with the `tfc` object, we can directly interact with smart contract:
```typescript
let balance = await tfc.balanceOf(account.address); // get token balance
await tfc.transfer(anotherAccount.address, new BN(10)); // transfer 10 tokens from default account to anotherAccount 
```

More APIs can be found in the [documentation](https://troublor.github.io/jasmine-eth-ts/).
