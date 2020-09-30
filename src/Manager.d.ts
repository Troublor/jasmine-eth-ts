import Web3Wrapper from "./Web3Wrapper";
import Web3 from "web3";
import BN from "bn.js";
import { Address } from "./types";
import Account from "./Account";
/**
 * TFC manager represent the TFCManager smart contract, which serves as a proxy for TFC users to claim (withdraw) TFC tokens.
 */
export default class Manager extends Web3Wrapper {
    private readonly _address;
    private readonly _contract;
    private readonly _abi;
    /**
     * Construct an TFCManager object representing the TFCManager smart contract,
     * using web3 instance, address of contract and optionally a default account.
     *
     * Usually this constructor should not be called.
     * Manager objects should be instantiated by {@link SDK}.
     *
     * @param web3
     * @param managerAddress
     * @param defaultAccountPrivateKey
     */
    constructor(web3: Web3, managerAddress: Address, defaultAccountPrivateKey?: string);
    /**
     * Get the address of the TFCToken ERC20 contract, which are created/managed by the manager.
     */
    tfcAddress(): Promise<Address>;
    /**
     * Get the address of the signer who have the privilege to authorize users to claim TFC tokens
     */
    signer(): Promise<Address>;
    /**
     * Check if the nonce (for TFCClaim) has been used
     * @param nonce
     */
    nonceUsed(nonce: BN): Promise<boolean>;
    /**
     * Get one unused nonce, which will be used in signing TFCClaim message
     */
    getUnusedNonce(): Promise<BN>;
    /**
     * Claim TFC tokens with the authorization from signer.
     * This is the function called by users who want to claim/withdraw TFC tokens.
     *
     * @param amount the amount of TFC token to claim
     * @param nonce the nonce used in the signature
     * @param sig the signature signed by the signer who has privilege to authorize TFC claim
     * @param claimer the account to receive the claimed TFC tokens. It must be the same with the recipient of signature
     */
    claimTFC(amount: BN, nonce: BN, sig: string, claimer: Account): Promise<void>;
    /**
     * Sign a message to claim TFC tokens.
     *
     * @param recipient the account to receive TFC tokens
     * @param amount the amount of TFC tokens to claim
     * @param nonce the nonce used. Each nonce can only be used once
     * @param signer the account who has the privilege to authorize TFC claim
     */
    signTFCClaim(recipient: Address, amount: BN, nonce: BN, signer: Account): string;
}
//# sourceMappingURL=Manager.d.ts.map