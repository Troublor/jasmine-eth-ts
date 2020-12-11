"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Web3Wrapper {
    constructor(web3) {
        this._confirmationRequirement = 0;
        this._web3 = web3;
    }
    get web3() {
        return this._web3;
    }
    get confirmationRequirement() {
        return this._confirmationRequirement;
    }
    set confirmationRequirement(value) {
        this._confirmationRequirement = value;
    }
    async signContractTransaction(transaction, to, options) {
        const nonce = await this._web3.eth.getTransactionCount(options.from.address);
        const gasLimit = options.gas
            ? options.gas
            : await transaction.estimateGas({ from: options.from.address });
        const gasPrice = await this._web3.eth.getGasPrice();
        const rawTx = {
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
    async signSimpleTransaction(transaction, to, options) {
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
    async sendTransaction(transaction, to, options) {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve, reject) => {
            try {
                let signedTx;
                // eslint-disable-next-line no-prototype-builtins
                if (transaction.hasOwnProperty("estimateGas")) {
                    signedTx = await this.signContractTransaction(transaction, to, options);
                }
                else {
                    signedTx = await this.signSimpleTransaction(transaction, to, options);
                }
                const promiEvent = this.web3.eth.sendSignedTransaction(signedTx.rawTransaction);
                let resolved = false;
                const confirmationHandler = (confNumber, receipt) => {
                    if (resolved) {
                        return;
                    }
                    if (this._confirmationRequirement && confNumber >= this._confirmationRequirement) {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        promiEvent.removeAllListeners("receipt");
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        promiEvent.removeAllListeners("confirmation");
                        resolve(receipt);
                        resolved = true;
                    }
                };
                const receiptHandler = (receipt) => {
                    if (resolved) {
                        return;
                    }
                    if (!this._confirmationRequirement) {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        promiEvent.removeAllListeners("receipt");
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
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
            }
            catch (e) {
                reject(e);
            }
        });
    }
}
exports.default = Web3Wrapper;
//# sourceMappingURL=Web3Wrapper.js.map