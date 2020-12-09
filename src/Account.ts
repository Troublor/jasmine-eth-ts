import { Address } from "./types";
import Web3Wrapper from "./Web3Wrapper";
import Web3 from "web3";
import TFC from "./TFC";
import * as Web3Core from "web3-core";

/**
 * The Ethereum account representation.
 */
export default class Account extends Web3Wrapper {
    public readonly web3Account: Web3Core.Account;

    /**
     * Construct the account object using web3 instance and privateKey.
     * Usually this constructor should not be called.
     * Account objects should be instantiated by {@link SDK}.
     *
     * @param web3
     * @param privateKey
     */
    constructor(web3: Web3, privateKey: string) {
        super(web3);
        this.web3Account = web3.eth.accounts.privateKeyToAccount(privateKey);
    }

    /**
     * The Ethereum address of this account.
     */
    get address(): Address {
        return this.web3Account.address;
    }

    /**
     * The private key of this account;
     */
    get privateKey(): string {
        return this.web3Account.privateKey;
    }
}
