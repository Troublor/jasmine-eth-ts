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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var web3_1 = __importDefault(require("web3"));
var TFC_1 = __importDefault(require("./TFC"));
var Account_1 = __importDefault(require("./Account"));
var Web3Wrapper_1 = __importDefault(require("./Web3Wrapper"));
var bn_js_1 = __importDefault(require("bn.js"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
/**
 * SDK class for jasmine ethereum client.
 */
var SDK = /** @class */ (function (_super) {
    __extends(SDK, _super);
    /**
     * Construct SDK object using ethereum endpoint.
     * Ethereum endpoint can be a url (e.g. http://localhost:8545) or a web3.js-compatible provider
     *
     * @param ethereumEndpoint url or web3.js provider
     */
    function SDK(ethereumEndpoint) {
        return _super.call(this, new web3_1.default(ethereumEndpoint)) || this;
    }
    /**
     * Set the default account of this SDK.
     *
     * @param privateKeyOrAccount private key string or an object of {@link Account}
     */
    SDK.prototype.setDefaultAccount = function (privateKeyOrAccount) {
        var privateKey;
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
        _super.prototype.setDefaultAccount.call(this, privateKey);
    };
    /**
     * Deploy TFC ERC20 contract on the underling blockchain.
     *
     * @param initialHolders the list of initial accounts that will get initial supply (100 million token each) (the number must be 20)
     * @param sender the transaction sender who creates the contract
     */
    SDK.prototype.deployTFC = function (initialHolders, sender) {
        var _this = this;
        if (initialHolders.length !== 20) {
            throw new Error("number of initial holders must be exactly 20");
        }
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var abi, data, contract, tx;
            return __generator(this, function (_a) {
                abi = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, "contracts", "TFCToken.abi.json")).toString());
                data = fs_1.default.readFileSync(path_1.default.join(__dirname, "contracts", "TFCToken.bin"));
                contract = new this.web3.eth.Contract(abi);
                tx = contract.deploy({
                    data: data.toString().trim(),
                    arguments: [
                        initialHolders.map(function (account) { return account.address; }),
                        Array(20).fill(new bn_js_1.default('100000000', 10).mul(new bn_js_1.default('1000000000000000000', 10))) // each get 100 million tokens (decimals 18)
                    ],
                });
                this.sendTransaction(tx, undefined, {
                    from: sender ? sender.defaultWeb3Account : this.defaultWeb3Account,
                    gas: 6000000
                })
                    .then(function (receipt) {
                    resolve(receipt.contractAddress);
                })
                    .catch(reject);
                return [2 /*return*/];
            });
        }); });
    };
    /**
     * Get the {@link TFC} instance.
     *
     * @param tfcAddress the address of the smart contract of {@link TFC}
     * @param privateKeyOrDefaultAccount the private key or account object of the default account
     * used to send transactions in the TFC instance.
     */
    SDK.prototype.getTFC = function (tfcAddress, privateKeyOrDefaultAccount) {
        var privateKey;
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
    };
    /**
     * Retrieve an account using private key.
     *
     * @param privateKey
     */
    SDK.prototype.retrieveAccount = function (privateKey) {
        return new Account_1.default(this.web3, privateKey);
    };
    /**
     * Create a new account.
     * Be sure to appropriately save the private key of the account to be able to retrieve next time.
     */
    SDK.prototype.createAccount = function () {
        var privateKey = this.web3.eth.accounts.create().privateKey;
        return new Account_1.default(this.web3, privateKey);
    };
    /**
     * Get the ether balance of one account.
     * The unit of returned value will be wei (10^-18 ether).
     *
     * @param address Ethereum account address
     */
    SDK.prototype.balanceOf = function (address) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.web3.eth.getBalance(address)
                .then(function (bal) {
                resolve(new bn_js_1.default(bal));
            })
                .catch(reject);
        });
    };
    /**
     * Transfer ether from sender to another address.
     * The ether is in the unit of wei.
     *
     * @param to recipient address
     * @param amount the amount of ether to transfer. (in the unit of wei)
     * @param sender sender account.
     */
    SDK.prototype.transfer = function (to, amount, sender) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.web3.eth.sendTransaction({
                to: to,
                value: amount,
                from: sender ? sender.address : _this.defaultWeb3Account.address,
            })
                .on("receipt", function () {
                if (!_this._confirmationRequirement) {
                    resolve();
                }
            })
                .on("confirmation", function (confNumber) {
                if (_this._confirmationRequirement && confNumber >= _this._confirmationRequirement) {
                    resolve();
                }
            })
                .on("error", reject);
        });
    };
    /**
     * Convert wei unit to ether unit
     *
     * @param amount
     */
    SDK.prototype.wei2ether = function (amount) {
        return new bn_js_1.default(this.web3.utils.fromWei(amount, 'ether'));
    };
    /**
     * Convert ether unit to wei unit
     *
     * @param amount
     */
    SDK.prototype.ether2wei = function (amount) {
        return new bn_js_1.default(this.web3.utils.toWei(amount, 'ether'));
    };
    return SDK;
}(Web3Wrapper_1.default));
exports.default = SDK;
//# sourceMappingURL=SDK.js.map