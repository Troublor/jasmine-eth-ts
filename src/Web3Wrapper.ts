import Web3 from "web3";
import Web3Core from "web3-core"
import {Address} from "./types";
import {TransactionObject} from "./contracts/types";
import {ContractSendMethod} from "web3-eth-contract";
import BN from "bn.js";

export interface TransactionConfig {
    from: string;
    to: string;
    value?: number | string | BN;
    gas?: number | string;
    gasPrice?: number | string | BN;
    data?: string;
    nonce?: number;
    chainId?: number;
}

export default abstract class Web3Wrapper {
    protected _web3: Web3;

    protected _defaultWeb3Account: Web3Core.Account;

    protected _confirmationRequirement: number;

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

    get confirmationRequirement(): number {
        return this._confirmationRequirement;
    }

    set confirmationRequirement(value: number) {
        this._confirmationRequirement = value;
    }

    protected async signContractTransaction(transaction: TransactionObject<any> | ContractSendMethod, to: Address, options: { from?: Web3Core.Account, value?: number | string | BN, gas?: number } = {}): Promise<Web3Core.SignedTransaction> {
        if (!options.from) {
            options.from = this._defaultWeb3Account;
        }
        let nonce = await this._web3.eth.getTransactionCount(options.from.address);
        let gasLimit = options.gas ? options.gas : await transaction.estimateGas({from: options.from.address});
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

    protected async signSimpleTransaction(transaction: TransactionConfig, to: Address, options: { from?: Web3Core.Account, value?: number | string | BN, gas?: number } = {}): Promise<Web3Core.SignedTransaction> {
        transaction.to = to;
        if (options.value) {
            transaction.value = options.value;
        }
        if (options.gas) {
            transaction.gas = options.gas;
        }
        if (!transaction.gasPrice) {
            transaction.gasPrice = await this.web3.eth.getGasPrice();
        }
        if (!transaction.gas) {
            transaction.gas = await this.web3.eth.estimateGas(transaction);
        }
        if (!transaction.nonce) {
            transaction.nonce = await this.web3.eth.getTransactionCount(transaction.from, "pending");
        }
        if (!transaction.chainId) {
            transaction.chainId = await this.web3.eth.getChainId();
        }
        if (!options.from) {
            options.from = this._defaultWeb3Account;
        }
        return await options.from.signTransaction(transaction);
    }

    protected async sendTransaction(transaction: TransactionObject<any> | ContractSendMethod | TransactionConfig, to: Address, options: { from?: Web3Core.Account, value?: number | string | BN, gas?: number } = {}): Promise<Web3Core.TransactionReceipt> {
        return new Promise<Web3Core.TransactionReceipt>(async (resolve, reject) => {
            try {
                let signedTx;
                if (transaction.hasOwnProperty("estimateGas")) {
                    signedTx = await this.signContractTransaction(transaction as (TransactionObject<any> | ContractSendMethod), to, options);
                } else {
                    signedTx = await this.signSimpleTransaction(transaction as TransactionConfig, to, options)
                }
                const promiEvent = this.web3.eth.sendSignedTransaction(signedTx.rawTransaction);
                let resolved = false;
                const confirmationHandler = (confNumber, receipt) => {
                    if (resolved) {
                        return;
                    }
                    if (this._confirmationRequirement && confNumber >= this._confirmationRequirement) {
                        // @ts-ignore
                        promiEvent.removeAllListeners("receipt");
                        // @ts-ignore
                        promiEvent.removeAllListeners("confirmation");
                        resolve(receipt);
                        resolved = true;
                    }
                };
                const receiptHandler = receipt => {
                    if (resolved) {
                        return;
                    }
                    if (!this._confirmationRequirement) {
                        // @ts-ignore
                        promiEvent.removeAllListeners("receipt");
                        // @ts-ignore
                        promiEvent.removeAllListeners("confirmation");
                        resolve(receipt);
                        resolved = true;
                    }
                };
                promiEvent
                    .once("receipt", receiptHandler)
                    .on("confirmation", confirmationHandler)
                    .once("error", reject)
            } catch (e) {
                reject(e);
            }
        });
    }
}
