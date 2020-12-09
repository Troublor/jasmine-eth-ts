import Web3Wrapper from "./Web3Wrapper";
import Web3Utils from "web3-utils";
import Web3 from "web3";
import fs from "fs";
import path from "path";
import {TfcManager } from "./contracts/TFCManager";
import BN from "bn.js";
import { Address } from "./types";
import Account from "./Account";

/**
 * TFC manager represent the TFCManager smart contract, which serves as a proxy for TFC users to claim (withdraw) TFC tokens.
 */
export default class Manager extends Web3Wrapper {
    private readonly _address: Address;
    private readonly _contract: TfcManager;
    private readonly _abi: Web3Utils.AbiItem[];

    /**
     * Construct an TFCManager object representing the TFCManager smart contract,
     * using web3 instance, address of contract
     *
     * Usually this constructor should not be called.
     * Manager objects should be instantiated by {@link SDK}.
     *
     * @param web3
     * @param managerAddress
     */
    constructor(web3: Web3, managerAddress: Address) {
        super(web3);
        this._address = managerAddress;
        this._abi = JSON.parse(fs.readFileSync(path.join(__dirname, "contracts", "TFCManager.abi.json")).toString());
        this._contract = (new web3.eth.Contract(this._abi, managerAddress) as unknown) as TfcManager;
    }

    /**
     * Get the address of the TFCToken ERC20 contract, which are created/managed by the manager.
     */
    public async tfcAddress(): Promise<Address> {
        return this._contract.methods.tfcToken().call();
    }

    /**
     * Get the address of the signer who have the privilege to authorize users to claim TFC tokens
     */
    public async signer(): Promise<Address> {
        return this._contract.methods.signer().call();
    }

    /**
     * Check if the nonce (for TFCClaim) has been used
     * @param nonce
     */
    public async nonceUsed(nonce: BN): Promise<boolean> {
        return this._contract.methods.usedNonces(nonce.toString()).call();
    }

    /**
     * Get one unused nonce, which will be used in signing TFCClaim message
     */
    public async getUnusedNonce(): Promise<BN> {
        let nonce = new BN(0);
        // find an unused nonce
        while (await this.nonceUsed(nonce)) {
            nonce = nonce.add(new BN(1));
        }
        return nonce;
    }

    /**
     * Claim TFC tokens with the authorization from signer.
     * This is the function called by users who want to claim/withdraw TFC tokens.
     *
     * @param amount the amount of TFC token to claim
     * @param nonce the nonce used in the signature
     * @param sig the signature signed by the signer who has privilege to authorize TFC claim
     * @param claimer the account to receive the claimed TFC tokens. It must be the same with the recipient of signature
     */
    public async claimTFC(amount: BN, nonce: BN, sig: string, claimer: Account): Promise<void> {
        const tx = this._contract.methods.claimTFC(amount.toString(), nonce.toString(), sig);
        return new Promise<void>((resolve, reject) => {
            this.sendTransaction(tx, this._address, {
                from: claimer.web3Account,
            })
                .then(() => resolve())
                .catch(reject);
        });
    }

    /**
     * Sign a message to claim TFC tokens.
     *
     * @param recipient the account to receive TFC tokens
     * @param amount the amount of TFC tokens to claim
     * @param nonce the nonce used. Each nonce can only be used once
     * @param signer the account who has the privilege to authorize TFC claim
     */
    public signTFCClaim(recipient: Address, amount: BN, nonce: BN, signer: Account): string {
        const hash = this.web3.utils.soliditySha3(recipient, amount, nonce, this._address) as string;
        return this.web3.eth.accounts.sign(hash, signer.privateKey).signature;
    }
}
