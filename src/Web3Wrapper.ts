import Web3 from "web3";
import Web3Core from "web3-core";
import { Address } from "./types";
import { PayableTransactionObject, NonPayableTransactionObject } from "./contracts/types";
import { ContractSendMethod } from "web3-eth-contract";
import BN from "bn.js";

export default abstract class Web3Wrapper {
    protected _web3: Web3;

    protected _confirmationRequirement = 0;

    protected constructor(web3: Web3) {
        this._web3 = web3;
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

    protected async signContractTransaction(
        transaction: PayableTransactionObject<any> | NonPayableTransactionObject<any> | ContractSendMethod,
        to: Address | undefined,
        options: { from: Web3Core.Account; value?: number | string | BN; gas?: number },
    ): Promise<Web3Core.SignedTransaction> {
        const nonce = await this._web3.eth.getTransactionCount((options.from as Web3Core.Account).address);
        const gasLimit = options.gas
            ? options.gas
            : await transaction.estimateGas({ from: (options.from as Web3Core.Account).address });
        const gasPrice = await this._web3.eth.getGasPrice();
        const rawTx: Web3Core.TransactionConfig = {
            from: (options.from as Web3Core.Account).address,
            to: to,
            nonce: nonce,
            value: options.value,
            data: transaction.encodeABI(),
            gas: gasLimit,
            gasPrice: gasPrice,
        };
        return await (options.from as Web3Core.Account).signTransaction(rawTx);
    }

    protected async signSimpleTransaction(
        transaction: Web3Core.TransactionConfig,
        to: Address | undefined,
        options: { from: Web3Core.Account; value?: number | string | BN; gas?: number },
    ): Promise<Web3Core.SignedTransaction> {
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
            transaction.nonce = await this.web3.eth.getTransactionCount(options.from.address, "pending");
        }
        if (!transaction.chainId) {
            transaction.chainId = await this.web3.eth.getChainId();
        }
        return await options.from.signTransaction(transaction);
    }

    protected async sendTransaction(
        transaction: ContractSendMethod | PayableTransactionObject<any> | NonPayableTransactionObject<any> | Web3Core.TransactionConfig,
        to: Address | undefined,
        options: { from: Web3Core.Account; value?: number | string | BN; gas?: number },
    ): Promise<Web3Core.TransactionReceipt> {
        return new Promise<Web3Core.TransactionReceipt>(async (resolve, reject) => {
            try {
                let signedTx;
                if (transaction.hasOwnProperty("estimateGas")) {
                    signedTx = await this.signContractTransaction(
                        transaction as PayableTransactionObject<any> | NonPayableTransactionObject<any> | ContractSendMethod,
                        to,
                        options,
                    );
                } else {
                    signedTx = await this.signSimpleTransaction(transaction as Web3Core.TransactionConfig, to, options);
                }
                const promiEvent = this.web3.eth.sendSignedTransaction(signedTx.rawTransaction as string);
                let resolved = false;
                const confirmationHandler = (confNumber: number, receipt: Web3Core.TransactionReceipt) => {
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
                const receiptHandler = (receipt: Web3Core.TransactionReceipt) => {
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
                    .once("error", reject);
            } catch (e) {
                reject(e);
            }
        });
    }
}
