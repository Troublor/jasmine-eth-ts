import TFC from "./TFC";
import { Address } from "./types";
import Account from "./Account";
import Web3Wrapper from "./Web3Wrapper";
import BN from "bn.js";
import Web3Core from "web3-core";
/**
 * SDK class for jasmine ethereum client.
 */
export default class SDK extends Web3Wrapper {
    /**
     * Construct SDK object using ethereum endpoint.
     * Ethereum endpoint can be a url (e.g. http://localhost:8545) or a web3.js-compatible provider
     *
     * @param ethereumEndpoint url or web3.js provider
     */
    constructor(ethereumEndpoint: string | Web3Core.provider);
    /**
     * Set the default account of this SDK.
     *
     * @param privateKeyOrAccount private key string or an object of {@link Account}
     */
    setDefaultAccount(privateKeyOrAccount: string | Account): void;
    /**
     * Deploy TFC ERC20 contract on the underling blockchain.
     *
     * @param initialHolders the list of initial accounts that will get initial supply (100 million token each) (the number must be 20)
     * @param sender the transaction sender who creates the contract
     */
    deployTFC(initialHolders: Account[], sender?: Account): Promise<Address>;
    /**
     * Get the {@link TFC} instance.
     *
     * @param tfcAddress the address of the smart contract of {@link TFC}
     * @param privateKeyOrDefaultAccount the private key or account object of the default account
     * used to send transactions in the TFC instance.
     */
    getTFC(tfcAddress: Address, privateKeyOrDefaultAccount?: string | Account): TFC;
    /**
     * Retrieve an account using private key.
     *
     * @param privateKey
     */
    retrieveAccount(privateKey: string): Account;
    /**
     * Create a new account.
     * Be sure to appropriately save the private key of the account to be able to retrieve next time.
     */
    createAccount(): Account;
    /**
     * Get the ether balance of one account.
     * The unit of returned value will be wei (10^-18 ether).
     *
     * @param address Ethereum account address
     */
    balanceOf(address: Address): Promise<BN>;
    /**
     * Transfer ether from sender to another address.
     * The ether is in the unit of wei.
     *
     * @param to recipient address
     * @param amount the amount of ether to transfer. (in the unit of wei)
     * @param sender sender account.
     */
    transfer(to: Address, amount: BN, sender?: Account): Promise<void>;
    /**
     * Convert wei unit to ether unit
     *
     * @param amount
     */
    wei2ether(amount: BN): BN;
    /**
     * Convert ether unit to wei unit
     *
     * @param amount
     */
    ether2wei(amount: BN): BN;
}
//# sourceMappingURL=SDK.d.ts.map