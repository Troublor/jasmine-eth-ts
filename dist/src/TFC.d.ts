import { Address } from "./types";
import { TfcToken } from "./contracts/TFCToken";
import Web3 from "web3";
import Web3Utils from "web3-utils";
import Web3Wrapper from "./Web3Wrapper";
import BN from "bn.js";
import Account from "./Account";
/**
 * TFC Token contract representation.
 *
 */
export default class TFC extends Web3Wrapper {
    readonly address: Address;
    readonly _contract: TfcToken;
    readonly _abi: Web3Utils.AbiItem[];
    /**
     * Construct an TFC object using web3 instance, address of contract
     * Usually this constructor should not be called.
     * TFC objects should be instantiated by {@link SDK}.
     *
     * @param web3
     * @param tfcAddress
     */
    constructor(web3: Web3, tfcAddress: Address);
    /**
     * Get the web3.js contract object.
     */
    get contract(): TfcToken;
    get abi(): Web3Utils.AbiItem[];
    /**
     * Get the name of TFC Token.
     */
    name(): Promise<string>;
    /**
     * Get the symbol of TFC Token
     */
    symbol(): Promise<string>;
    /**
     * Get the number of decimals TFC token uses.
     */
    decimals(): Promise<number>;
    /**
     * Get the total supply of TFC Token.
     */
    totalSupply(): Promise<BN>;
    /**
     * Get the amount of token which spender is still allowed to withdraw from owner.
     * This method is useful when a user delegate an agent to spend his tokens.
     *
     * @param owner Ethereum address of owner
     * @param spender Ethereum address of spender
     */
    allowance(owner: Address, spender: Address): Promise<BN>;
    /**
     * Get the TFC Token balance of the account.
     *
     * @param owner Ethereum address of the account
     */
    balanceOf(owner: Address): Promise<BN>;
    /**
     * Get a list of Ethereum addresses of administrators of TFC Token.
     * Administrators are qualified to mint new tokens.
     */
    adminAddresses(): Promise<Address[]>;
    /**
     * Check if one account is allowed to mint new tokens.
     *
     * @param sender the account to check.
     * @param sender the account to check.
     */
    canMint(sender: Account): Promise<boolean>;
    /**
     * Transfer money from sender to another account
     *
     * @param to Ethereum address of the recipient account
     * @param amount the amount of tokens to transfer
     * @param sender the sender account of this transaction.
     */
    transfer(to: Address, amount: BN, sender: Account): Promise<void>;
    /**
     * Transfer money from account {@param from} to account {@param to}.
     * This is useful when an agent transfers tokens as a delegate of a user.
     * The transaction sender must have enough allowance from account {@param from} to spend tokens.
     *
     * @param from Ethereum address of the account whose tokens are transferred out
     * @param to Ethereum address of the account who receives the tokens
     * @param amount the amount to transfer
     * @param sender transaction sender.
     * This sender is different from the {@param from}.
     */
    transferFrom(from: Address, to: Address, amount: BN, sender: Account): Promise<void>;
    /**
     * Approve one spender a certain amount of token to spend.
     *
     * @param spender Ethereum address of the spender
     * @param amount the amount of tokens to approve
     * @param sender transaction sender, the owner of the token.
     */
    approve(spender: Address, amount: BN, sender: Account): Promise<void>;
    /**
     * Mint a certain amount of tokens from nowhere and put the tokens in one account.
     * The transaction sender must be the one of administrators listed by {@link TFC.adminAddresses}.
     *
     * @param to Ethereum address of the account to received the minted tokens
     * @param amount the amount of tokens to mint
     * @param sender transaction sender.
     */
    mint(to: Address, amount: BN, sender: Account): Promise<void>;
    /**
     * Perform a one-to-many token transfer, tokens are transferred from the sender's account to the recipients.
     *
     * @param bundledTransfer the bundled transfer recipient and amount
     * @param sender the sender who sends the transaction and whose tokens are transferred
     */
    one2manyTransfer(bundledTransfer: {
        recipient: Address;
        amount: BN;
    }[], sender: Account): Promise<void>;
    /**
     * Check whether TFC ERC20 has been deployed on current network
     */
    deployed(): Promise<boolean>;
}
//# sourceMappingURL=TFC.d.ts.map