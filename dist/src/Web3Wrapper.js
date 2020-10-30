"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Web3Wrapper {
    constructor(web3, privateKeyOrWeb3Account) {
        this._web3 = web3;
        if (typeof privateKeyOrWeb3Account === "string") {
            this._defaultWeb3Account = web3.eth.accounts.privateKeyToAccount(privateKeyOrWeb3Account);
        }
        else if (typeof privateKeyOrWeb3Account == "object") {
            this._defaultWeb3Account = privateKeyOrWeb3Account;
        }
        else {
            this._defaultWeb3Account = undefined;
        }
    }
    setDefaultAccount(privateKey) {
        this._defaultWeb3Account = this._web3.eth.accounts.privateKeyToAccount(privateKey);
    }
    get defaultAccountAddress() {
        var _a;
        return (_a = this._defaultWeb3Account) === null || _a === void 0 ? void 0 : _a.address;
    }
    get defaultWeb3Account() {
        return this._defaultWeb3Account;
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
    async signContractTransaction(transaction, to, options = {}) {
        if (!options.from) {
            options.from = this._defaultWeb3Account;
        }
        let nonce = await this._web3.eth.getTransactionCount(options.from.address);
        let gasLimit = options.gas ? options.gas : await transaction.estimateGas({ from: options.from.address });
        let gasPrice = await this._web3.eth.getGasPrice();
        let rawTx = {
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
    async signSimpleTransaction(transaction, to, options = {}) {
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
    async sendTransaction(transaction, to, options = {}) {
        return new Promise(async (resolve, reject) => {
            try {
                let signedTx;
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