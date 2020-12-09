"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Web3Wrapper_1 = __importDefault(require("./Web3Wrapper"));
/**
 * The Ethereum account representation.
 */
class Account extends Web3Wrapper_1.default {
    /**
     * Construct the account object using web3 instance and privateKey.
     * Usually this constructor should not be called.
     * Account objects should be instantiated by {@link SDK}.
     *
     * @param web3
     * @param privateKey
     */
    constructor(web3, privateKey) {
        super(web3);
        this.web3Account = web3.eth.accounts.privateKeyToAccount(privateKey);
    }
    /**
     * The Ethereum address of this account.
     */
    get address() {
        return this.web3Account.address;
    }
    /**
     * The private key of this account;
     */
    get privateKey() {
        return this.web3Account.privateKey;
    }
}
exports.default = Account;
//# sourceMappingURL=Account.js.map