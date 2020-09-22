import Web3 from "web3";
import Web3Core from "web3-core"
import {Address} from "./types";
import {TransactionObject} from "./contracts/types";
import PromiEvent from "web3/promiEvent";
import BN from "bn.js";

export default abstract class Web3Wrapper {
    protected _web3: Web3;

    protected _defaultAccount: Web3Core.Account;

    protected constructor(web3: Web3, privateKeyOrAccount?: string | Web3Core.Account) {
        this._web3 = web3;
        if (typeof privateKeyOrAccount === "string") {
            this._defaultAccount = web3.eth.accounts.privateKeyToAccount(privateKeyOrAccount);
        } else if (typeof privateKeyOrAccount == "object") {
            this._defaultAccount = privateKeyOrAccount;
        } else {
            this._defaultAccount = undefined;
        }
    }

    protected setDefaultAccount(privateKey: string) {
        this._defaultAccount = this._web3.eth.accounts.privateKeyToAccount(privateKey);
    }

    get defaultAccountAddress(): Address {
        return this._defaultAccount.address;
    }

    get defaultAccount(): Web3Core.Account {
        return this._defaultAccount;
    }

    get web3(): Web3 {
        return this._web3;
    }

    // @ts-ignore
    protected async sendTransaction(transaction: TransactionObject<any>, to: Address, from?: Web3Core.Account, value?: number | string | BN): PromiEvent<Web3Core.TransactionReceipt> {
        if (!from) {
            from = this._defaultAccount;
        }
        let nonce = await this._web3.eth.getTransactionCount(from.address);
        let gasLimit = await transaction.estimateGas({from: from.address});
        let gasPrice = await this._web3.eth.getGasPrice();
        let rawTx: Web3Core.TransactionConfig = {
            from: from.address,
            to: to,
            value: value,
            data: transaction.encodeABI(),
        };
        let signedTx = await this._defaultAccount.signTransaction(rawTx);
        return this._web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    }
};
