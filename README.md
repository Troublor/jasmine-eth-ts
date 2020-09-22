# Jasmine Project Ethereum SDK 
#### Typescript Implementation

## SDK 

SDK wraps the interactions with `TFC` ERC20 Token contract on Ethereum. 
A detailed documentation can be found in [`docs`](https://github.io/Troublor/jasmine-eth-ts)

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

More APIs can be found in the [documentation](https://github.io/Troublor/jasmine-eth-ts).
