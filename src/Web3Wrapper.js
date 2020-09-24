"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var Web3Wrapper = /** @class */ (function () {
    function Web3Wrapper(web3, privateKeyOrWeb3Account) {
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
    Web3Wrapper.prototype.setDefaultAccount = function (privateKey) {
        this._defaultWeb3Account = this._web3.eth.accounts.privateKeyToAccount(privateKey);
    };
    Object.defineProperty(Web3Wrapper.prototype, "defaultAccountAddress", {
        get: function () {
            var _a;
            return (_a = this._defaultWeb3Account) === null || _a === void 0 ? void 0 : _a.address;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Web3Wrapper.prototype, "defaultWeb3Account", {
        get: function () {
            return this._defaultWeb3Account;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Web3Wrapper.prototype, "web3", {
        get: function () {
            return this._web3;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Web3Wrapper.prototype, "confirmationRequirement", {
        get: function () {
            return this._confirmationRequirement;
        },
        set: function (value) {
            this._confirmationRequirement = value;
        },
        enumerable: false,
        configurable: true
    });
    Web3Wrapper.prototype.signTransaction = function (transaction, to, options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var nonce, gasLimit, _a, gasPrice, rawTx;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!options.from) {
                            options.from = this._defaultWeb3Account;
                        }
                        return [4 /*yield*/, this._web3.eth.getTransactionCount(options.from.address)];
                    case 1:
                        nonce = _b.sent();
                        if (!options.gas) return [3 /*break*/, 2];
                        _a = options.gas;
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, transaction.estimateGas({ from: options.from.address })];
                    case 3:
                        _a = _b.sent();
                        _b.label = 4;
                    case 4:
                        gasLimit = _a;
                        return [4 /*yield*/, this._web3.eth.getGasPrice()];
                    case 5:
                        gasPrice = _b.sent();
                        rawTx = {
                            from: options.from.address,
                            to: to,
                            nonce: nonce,
                            value: options.value,
                            data: transaction.encodeABI(),
                            gas: gasLimit,
                            gasPrice: gasPrice,
                        };
                        return [4 /*yield*/, options.from.signTransaction(rawTx)];
                    case 6: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    Web3Wrapper.prototype.sendTransaction = function (transaction, to, options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var signedTx, e_1;
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, this.signTransaction(transaction, to, options)];
                                case 1:
                                    signedTx = _a.sent();
                                    this.web3.eth.sendSignedTransaction(signedTx.rawTransaction)
                                        .on("receipt", function (receipt) {
                                        if (!_this._confirmationRequirement) {
                                            resolve(receipt);
                                        }
                                    })
                                        .on("confirmation", function (confNumber, receipt) {
                                        if (_this._confirmationRequirement && confNumber >= _this._confirmationRequirement) {
                                            resolve(receipt);
                                        }
                                    })
                                        .on("error", reject);
                                    return [3 /*break*/, 3];
                                case 2:
                                    e_1 = _a.sent();
                                    reject(e_1);
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    return Web3Wrapper;
}());
exports.default = Web3Wrapper;
//# sourceMappingURL=Web3Wrapper.js.map