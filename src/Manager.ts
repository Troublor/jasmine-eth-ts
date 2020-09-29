import Web3Wrapper from "./Web3Wrapper";
import Web3Utils from "web3-utils";
import Web3 from "web3";
import fs from "fs";
import path from "path";
import {TFCManager} from "./contracts/TFCManager";
import BN from "bn.js";
import {Address} from "./types";
import Account from "./Account";

/**
 * TFC manager represent the TFCManager smart contract, which serves as a proxy for TFC users to claim (withdraw) TFC tokens.
 */
export default class Manager extends Web3Wrapper {
    private readonly _address: Address;
    private readonly _contract: TFCManager;
    private readonly _abi: Web3Utils.AbiItem[];

    constructor(web3: Web3, managerAddress: Address, defaultAccountPrivateKey?: string) {
        super(web3, defaultAccountPrivateKey);
        this._address = managerAddress;
        this._abi = JSON.parse(fs.readFileSync(path.join(__dirname, "contracts", "TFCManager.abi.json")).toString());
        this._contract = new web3.eth.Contract(this._abi, managerAddress);
    }

    public async tfcAddress(): Promise<string> {
        return this._contract.methods.tfcToken().call();
    }

    public async signer(): Promise<string> {
        return this._contract.methods.signer().call();
    }

    public async nonceUsed(nonce: BN): Promise<boolean> {
        return this._contract.methods.usedNonces(nonce.toString("hex")).call();
    }

    public async claimTFC(amount: BN, nonce: BN, sig: string, sender?: Account): Promise<void> {
        let tx = this._contract.methods.claimTFC(amount.toString('hex'), nonce.toString("hex"), sig);
        return new Promise<void>((resolve, reject) => {
            this.sendTransaction(tx, this._address, {
                from: sender ? sender.defaultWeb3Account : this.defaultWeb3Account,
            })
                .then(() => resolve())
                .catch(reject);
        });
    }

    public signTFCClaim(recipient: Address, amount: BN, nonce: BN, signer: Account): string {
        const hash = this.web3.utils.soliditySha3(recipient, amount.toString("hex"), nonce.toString('hex'), this._address);
        return this.web3.eth.accounts.sign(hash, signer.privateKey).signature;
    }
};
