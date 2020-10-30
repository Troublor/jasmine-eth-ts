"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const web3_1 = __importDefault(require("web3"));
const TFC_1 = __importDefault(require("./TFC"));
const Account_1 = __importDefault(require("./Account"));
const Web3Wrapper_1 = __importDefault(require("./Web3Wrapper"));
const bn_js_1 = __importDefault(require("bn.js"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const Manager_1 = __importDefault(require("./Manager"));
/**
 * SDK class for jasmine ethereum client.
 */
class SDK extends Web3Wrapper_1.default {
    /**
     * Construct SDK object using ethereum endpoint.
     * Ethereum endpoint can be a url (e.g. http://localhost:8545) or a web3.js-compatible provider
     *
     * @param ethereumEndpoint url or web3.js provider
     */
    constructor(ethereumEndpoint) {
        super(new web3_1.default(ethereumEndpoint));
    }
    /**
     * Set the default account of this SDK.
     *
     * @param privateKeyOrAccount private key string or an object of {@link Account}
     */
    setDefaultAccount(privateKeyOrAccount) {
        let privateKey;
        switch (typeof privateKeyOrAccount) {
            case "string":
                privateKey = privateKeyOrAccount;
                break;
            case "object":
                privateKey = privateKeyOrAccount.privateKey;
                break;
            default:
                privateKey = undefined;
        }
        super.setDefaultAccount(privateKey);
    }
    /**
     * Deploy TFC ERC20 contract on the underling blockchain.
     *
     * @param initialHolders the list of initial accounts that will get initial supply (100 million token each) (the number must be 20)
     * @param sender the transaction sender who creates the contract
     */
    deployTFC(initialHolders, sender) {
        if (initialHolders.length !== 20) {
            throw new Error("number of initial holders must be exactly 20");
        }
        return new Promise(async (resolve, reject) => {
            let abi = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, "contracts", "TFCToken.abi.json")).toString());
            let data = fs_1.default.readFileSync(path_1.default.join(__dirname, "contracts", "TFCToken.bin"));
            let contract = new this.web3.eth.Contract(abi);
            let tx = contract.deploy({
                data: data.toString().trim(),
                arguments: [
                    initialHolders.map(account => account.address),
                    Array(20).fill(new bn_js_1.default('100000000', 10).mul(new bn_js_1.default('1000000000000000000', 10))) // each get 100 million tokens (decimals 18)
                ],
            });
            this.sendTransaction(tx, undefined, {
                from: sender ? sender.defaultWeb3Account : this.defaultWeb3Account,
                gas: 6000000
            })
                .then(receipt => {
                resolve(receipt.contractAddress);
            })
                .catch(reject);
        });
    }
    /**
     * Deploy TFCManager contract on the underling blockchain.
     * The TFCManager contract will automatically deploy a TFC ERC20 contract and provides TFC claim service for users.
     *
     * @param sender the account used to deploy
     */
    deployManager(sender) {
        return new Promise(async (resolve, reject) => {
            let abi = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, "contracts", "TFCManager.abi.json")).toString());
            let data = fs_1.default.readFileSync(path_1.default.join(__dirname, "contracts", "TFCManager.bin"));
            let contract = new this.web3.eth.Contract(abi);
            let tx = contract.deploy({
                data: data.toString().trim(),
            });
            this.sendTransaction(tx, undefined, {
                from: sender ? sender.defaultWeb3Account : this.defaultWeb3Account,
                gas: 6000000
            })
                .then(async (receipt) => {
                resolve(receipt.contractAddress);
            })
                .catch(reject);
        });
    }
    /**
     * Get the {@link TFC} instance.
     *
     * @param tfcAddress the address of the smart contract of {@link TFC}
     * @param privateKeyOrDefaultAccount the private key or account object of the default account
     * used to send transactions in the TFC instance.
     */
    getTFC(tfcAddress, privateKeyOrDefaultAccount) {
        let privateKey;
        switch (typeof privateKeyOrDefaultAccount) {
            case "string":
                privateKey = privateKeyOrDefaultAccount;
                break;
            case "object":
                privateKey = privateKeyOrDefaultAccount.privateKey;
                break;
            default:
                if (this.defaultWeb3Account) {
                    privateKey = this.defaultWeb3Account.privateKey;
                }
                else {
                    privateKey = undefined;
                }
        }
        return new TFC_1.default(this.web3, tfcAddress, privateKey);
    }
    /**
     *  Get the {@link Manager} instance.
     *
     * @param managerAddress the address of the smart contract of {@link Manager}
     * @param privateKeyOrDefaultAccount the private key or account object of the default account
     * used to send transactions in the TFC instance.
     */
    getManager(managerAddress, privateKeyOrDefaultAccount) {
        let privateKey;
        switch (typeof privateKeyOrDefaultAccount) {
            case "string":
                privateKey = privateKeyOrDefaultAccount;
                break;
            case "object":
                privateKey = privateKeyOrDefaultAccount.privateKey;
                break;
            default:
                if (this.defaultWeb3Account) {
                    privateKey = this.defaultWeb3Account.privateKey;
                }
                else {
                    privateKey = undefined;
                }
        }
        return new Manager_1.default(this.web3, managerAddress, privateKey);
    }
    /**
     * Retrieve an account using private key.
     *
     * @param privateKey
     */
    retrieveAccount(privateKey) {
        return new Account_1.default(this.web3, privateKey);
    }
    /**
     * Create a new account.
     * Be sure to appropriately save the private key of the account to be able to retrieve next time.
     */
    createAccount() {
        let { privateKey } = this.web3.eth.accounts.create();
        return new Account_1.default(this.web3, privateKey);
    }
    /**
     * Get the ether balance of one account.
     * The unit of returned value will be wei (10^-18 ether).
     *
     * @param address Ethereum account address
     */
    balanceOf(address) {
        return new Promise((resolve, reject) => {
            this.web3.eth.getBalance(address)
                .then(bal => {
                resolve(new bn_js_1.default(bal));
            })
                .catch(reject);
        });
    }
    /**
     * Transfer ether from sender to another address.
     * The ether is in the unit of wei.
     *
     * @param to recipient address
     * @param amount the amount of ether to transfer. (in the unit of wei)
     * @param sender sender account.
     */
    transfer(to, amount, sender) {
        return new Promise(async (resolve, reject) => {
            const tx = {
                to: to,
                value: amount,
                from: sender ? sender.address : this.defaultWeb3Account.address,
            };
            this.sendTransaction(tx, to, { from: sender.defaultWeb3Account }).then(() => {
                resolve();
            }).catch(reject);
            // tx['gas'] = await this.web3.eth.estimateGas(tx);
            // tx['gasPrice'] = await this.web3.eth.getGasPrice();
            // const signedTx = await sender.defaultWeb3Account.signTransaction(tx);
            // this.web3.eth.sendSignedTransaction(signedTx.rawTransaction)
            //     .on("receipt", () => {
            //         if (!this._confirmationRequirement) {
            //             resolve();
            //         }
            //     })
            //     .on("confirmation", (confNumber) => {
            //         if (this._confirmationRequirement && confNumber >= this._confirmationRequirement) {
            //             resolve();
            //         }
            //     })
            //     .on("error", reject);
        });
    }
    /**
     * Convert wei unit to ether unit
     *
     * @param amount
     */
    wei2ether(amount) {
        return new bn_js_1.default(this.web3.utils.fromWei(amount, 'ether'));
    }
    /**
     * Convert ether unit to wei unit
     *
     * @param amount
     */
    ether2wei(amount) {
        return new bn_js_1.default(this.web3.utils.toWei(amount, 'ether'));
    }
}
exports.default = SDK;
//# sourceMappingURL=SDK.js.map