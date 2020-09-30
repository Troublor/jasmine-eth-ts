import { Address } from "./types";
import Web3Wrapper from "./Web3Wrapper";
import Web3 from "web3";
import TFC from "./TFC";
/**
 * The Ethereum account representation.
 */
export default class Account extends Web3Wrapper {
    /**
     * Construct the account object using web3 instance and privateKey.
     * Usually this constructor should not be called.
     * Account objects should be instantiated by {@link SDK}.
     *
     * @param web3
     * @param privateKey
     */
    constructor(web3: Web3, privateKey: string);
    /**
     * The Ethereum address of this account.
     */
    get address(): Address;
    /**
     * The private key of this account;
     */
    get privateKey(): string;
    /**
     * Get a {@link TFC} instance using this account as a default account.
     *
     * @param tfcAddress
     */
    getTFC(tfcAddress: Address): TFC;
}
//# sourceMappingURL=Account.d.ts.map