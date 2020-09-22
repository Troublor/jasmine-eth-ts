import {Address} from "./types";
import {TFCToken} from "./contracts/TFCToken";
import Web3 from "web3";
import Web3Utils from "web3-utils";
import Web3Wrapper from "./Web3Wrapper";
import fs from "fs";
import path from "path";
import BN from "bn.js";
import Account from "./Account";

export default class TFC extends Web3Wrapper {
    private readonly _address: Address;
    private readonly _contract: TFCToken;
    private readonly _abi: Web3Utils.AbiItem[];

    constructor(web3: Web3, tfcAddress: Address, defaultAccountPrivateKey?: string) {
        super(web3, defaultAccountPrivateKey);
        this._address = tfcAddress;
        this._abi = JSON.parse(fs.readFileSync(path.join(__dirname, "contracts", "TFCToken.abi.json")).toString());
        this._contract = new web3.eth.Contract(this._abi, tfcAddress);
    }

    get contract(): TFCToken {
        return this._contract;
    }

    public async name(): Promise<string> {
        return this._contract.methods.name().call();
    }

    public async symbol(): Promise<string> {
        return this._contract.methods.symbol().call();
    }

    public async decimals(): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            this._contract.methods.decimals().call()
                .then(r => {
                    resolve(parseInt(r));
                })
                .catch(reject);
        });
    }

    public async totalSupply(): Promise<BN> {
        return new Promise<BN>((resolve, reject) => {
            this._contract.methods.totalSupply().call()
                .then(r => {
                    resolve(new BN(r));
                })
                .catch(reject);
        });
    }

    public async allowance(owner: Address, spender: Address):
        Promise<BN> {
        return new Promise<BN>((resolve, reject) => {
            this._contract.methods.allowance(owner, spender).call()
                .then(r => {
                    resolve(new BN(r));
                })
                .catch(reject);
        });
    }

    public async balanceOf(owner: Address):
        Promise<BN> {
        return new Promise<BN>((resolve, reject) => {
            this._contract.methods.balanceOf(owner).call()
                .then(r => {
                    resolve(new BN(r));
                })
                .catch(reject);
        });
    }

    public async transfer(to: Address, amount: BN, sender?: Account): Promise<void> {
        let tx = this._contract.methods.transfer(to, amount.toString());
        return new Promise<void>((resolve, reject) => {
            this.sendTransaction(tx, this._address, {
                from: sender ? sender.defaultWeb3Account : this.defaultWeb3Account,
            })
                .then(() => resolve())
                .catch(reject);
        });
    }

    public async transferFrom(from: Address, to: Address, amount: BN, sender?: Account): Promise<void> {
        let tx = this._contract.methods.transferFrom(from, to, amount.toString());
        return new Promise<void>((resolve, reject) => {
            this.sendTransaction(tx, this._address, {
                from: sender ? sender.defaultWeb3Account : this.defaultWeb3Account,
            })
                .then(() => resolve())
                .catch(reject);
        });
    }

    public async approve(spender: Address, amount: BN, sender?: Account): Promise<void> {
        let tx = this._contract.methods.approve(spender, amount.toString());
        return new Promise<void>((resolve, reject) => {
            this.sendTransaction(tx, this._address, {
                from: sender ? sender.defaultWeb3Account : this.defaultWeb3Account,
            })
                .then(() => resolve())
                .catch(reject);
        });
    }
}
