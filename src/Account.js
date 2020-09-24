"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Web3Wrapper_1 = __importDefault(require("./Web3Wrapper"));
var TFC_1 = __importDefault(require("./TFC"));
/**
 * The Ethereum account representation.
 */
var Account = /** @class */ (function (_super) {
    __extends(Account, _super);
    /**
     * Construct the account object using web3 instance and privateKey.
     * Usually this constructor should not be called.
     * Account objects should be instantiated by {@link SDK}.
     *
     * @param web3
     * @param privateKey
     */
    function Account(web3, privateKey) {
        return _super.call(this, web3, privateKey) || this;
    }
    Object.defineProperty(Account.prototype, "address", {
        /**
         * The Ethereum address of this account.
         */
        get: function () {
            return this.defaultWeb3Account.address;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Account.prototype, "privateKey", {
        /**
         * The private key of this account;
         */
        get: function () {
            return this.defaultWeb3Account.privateKey;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Get a {@link TFC} instance using this account as a default account.
     *
     * @param tfcAddress
     */
    Account.prototype.getTFC = function (tfcAddress) {
        return new TFC_1.default(this.web3, tfcAddress, this.privateKey);
    };
    return Account;
}(Web3Wrapper_1.default));
exports.default = Account;
//# sourceMappingURL=Account.js.map