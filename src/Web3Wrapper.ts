import Web3 from "web3";
import Web3Core from "web3-core"
import {Address} from "./types";
import {TransactionObject} from "./contracts/types";
import {ContractSendMethod} from "web3-eth-contract";
import BN from "bn.js";


export default abstract class Web3Wrapper {
    protected _web3: Web3;

    protected _defaultWeb3Account: Web3Core.Account;

    protected constructor(web3: Web3, privateKeyOrWeb3Account?: string | Web3Core.Account) {
        this._web3 = web3;
        if (typeof privateKeyOrWeb3Account === "string") {
            this._defaultWeb3Account = web3.eth.accounts.privateKeyToAccount(privateKeyOrWeb3Account);
        } else if (typeof privateKeyOrWeb3Account == "object") {
            this._defaultWeb3Account = privateKeyOrWeb3Account;
        } else {
            this._defaultWeb3Account = undefined;
        }
    }

    protected setDefaultAccount(privateKey: string) {
        this._defaultWeb3Account = this._web3.eth.accounts.privateKeyToAccount(privateKey);
    }

    get defaultAccountAddress(): Address {
        return this._defaultWeb3Account?.address;
    }

    get defaultWeb3Account(): Web3Core.Account {
        return this._defaultWeb3Account;
    }

    get web3(): Web3 {
        return this._web3;
    }

    protected async signTransaction(transaction: TransactionObject<any> | ContractSendMethod, to: Address, options: { from?: Web3Core.Account, value?: number | string | BN, gas?: number } = {}): Promise<Web3Core.SignedTransaction> {
        if (!options.from) {
            options.from = this._defaultWeb3Account;
        }
        let nonce = await this._web3.eth.getTransactionCount(options.from.address);
        let gasLimit = options.gas ? options.gas : await this._web3.eth.estimateGas({from: options.from.address});
        let gasPrice = await this._web3.eth.getGasPrice();
        let rawTx: Web3Core.TransactionConfig = {
            from: options.from.address,
            to: to,
            nonce: nonce,
            value: options.value,
            data: transaction.encodeABI(),
            gas: gasLimit,
            gasPrice: gasPrice,
        };
        return await options.from.signTransaction(rawTx);
    }
}
