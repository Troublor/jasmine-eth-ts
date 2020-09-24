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
var Web3Wrapper_1 = __importDefault(require("./Web3Wrapper"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var bn_js_1 = __importDefault(require("bn.js"));
/**
 * TFC Token contract representation.
 *
 * Objects of this class can optionally set a default account, which will be used to send Ethereum transactions.
 */
var TFC = /** @class */ (function (_super) {
    __extends(TFC, _super);
    /**
     * Construct an TFC object using web3 instance, address of contract and optionally a default account.
     * Usually this constructor should not be called.
     * TFC objects should be instantiated by {@link SDK}.
     *
     * @param web3
     * @param tfcAddress
     * @param defaultAccountPrivateKey
     */
    function TFC(web3, tfcAddress, defaultAccountPrivateKey) {
        var _this = _super.call(this, web3, defaultAccountPrivateKey) || this;
        _this._address = tfcAddress;
        _this._abi = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, "contracts", "TFCToken.abi.json")).toString());
        _this._contract = new web3.eth.Contract(_this._abi, tfcAddress);
        return _this;
    }
    Object.defineProperty(TFC.prototype, "contract", {
        /**
         * Get the web3.js contract object.
         */
        get: function () {
            return this._contract;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Get the name of TFC Token.
     */
    TFC.prototype.name = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this._contract.methods.name().call()];
            });
        });
    };
    /**
     * Get the symbol of TFC Token
     */
    TFC.prototype.symbol = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this._contract.methods.symbol().call()];
            });
        });
    };
    /**
     * Get the number of decimals TFC token uses.
     */
    TFC.prototype.decimals = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this._contract.methods.decimals().call()
                            .then(function (r) {
                            resolve(parseInt(r));
                        })
                            .catch(reject);
                    })];
            });
        });
    };
    /**
     * Get the total supply of TFC Token.
     */
    TFC.prototype.totalSupply = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this._contract.methods.totalSupply().call()
                            .then(function (r) {
                            resolve(new bn_js_1.default(r));
                        })
                            .catch(reject);
                    })];
            });
        });
    };
    /**
     * Get the amount of token which spender is still allowed to withdraw from owner.
     * This method is useful when a user delegate an agent to spend his tokens.
     *
     * @param owner Ethereum address of owner
     * @param spender Ethereum address of spender
     */
    TFC.prototype.allowance = function (owner, spender) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this._contract.methods.allowance(owner, spender).call()
                            .then(function (r) {
                            resolve(new bn_js_1.default(r));
                        })
                            .catch(reject);
                    })];
            });
        });
    };
    /**
     * Get the TFC Token balance of the account.
     *
     * @param owner Ethereum address of the account
     */
    TFC.prototype.balanceOf = function (owner) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this._contract.methods.balanceOf(owner).call()
                            .then(function (r) {
                            resolve(new bn_js_1.default(r));
                        })
                            .catch(reject);
                    })];
            });
        });
    };
    /**
     * Get a list of Ethereum addresses of administrators of TFC Token.
     * Administrators are qualified to mint new tokens.
     */
    TFC.prototype.adminAddresses = function () {
        return __awaiter(this, void 0, void 0, function () {
            var adminRole, adminCount, _a, admins, i, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this._contract.methods.DEFAULT_ADMIN_ROLE().call()];
                    case 1:
                        adminRole = _d.sent();
                        _a = parseInt;
                        return [4 /*yield*/, this._contract.methods.getRoleMemberCount(adminRole).call()];
                    case 2:
                        adminCount = _a.apply(void 0, [_d.sent()]);
                        admins = [];
                        i = 0;
                        _d.label = 3;
                    case 3:
                        if (!(i < adminCount)) return [3 /*break*/, 6];
                        _c = (_b = admins).push;
                        return [4 /*yield*/, this._contract.methods.getRoleMember(adminRole, i).call()];
                    case 4:
                        _c.apply(_b, [_d.sent()]);
                        _d.label = 5;
                    case 5:
                        i++;
                        return [3 /*break*/, 3];
                    case 6: return [2 /*return*/, admins];
                }
            });
        });
    };
    /**
     * Check if one account is allowed to mint new tokens.
     *
     * @param sender (optional) the account to check. If omitted, use the default account.
     */
    TFC.prototype.canMint = function (sender) {
        return __awaiter(this, void 0, void 0, function () {
            var address, minterRole;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        address = sender ? sender.address : this.defaultAccountAddress;
                        return [4 /*yield*/, this._contract.methods.MINTER_ROLE().call()];
                    case 1:
                        minterRole = _a.sent();
                        return [4 /*yield*/, this._contract.methods.hasRole(minterRole, address).call()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Transfer money from sender to another account
     *
     * @param to Ethereum address of the recipient account
     * @param amount the amount of tokens to transfer
     * @param sender (optional) the sender account of this transaction. If omitted, use the default account.
     */
    TFC.prototype.transfer = function (to, amount, sender) {
        return __awaiter(this, void 0, void 0, function () {
            var tx;
            var _this = this;
            return __generator(this, function (_a) {
                tx = this._contract.methods.transfer(to, amount.toString());
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.sendTransaction(tx, _this._address, {
                            from: sender ? sender.defaultWeb3Account : _this.defaultWeb3Account,
                        })
                            .then(function () { return resolve(); })
                            .catch(reject);
                    })];
            });
        });
    };
    /**
     * Transfer money from account {@param from} to account {@param to}.
     * This is useful when an agent transfers tokens as a delegate of a user.
     * The transaction sender must have enough allowance from account {@param from} to spend tokens.
     *
     * @param from Ethereum address of the account whose tokens are transferred out
     * @param to Ethereum address of the account who receives the tokens
     * @param amount the amount to transfer
     * @param sender (optional) transaction sender. If omitted, use the default account.
     * This sender is different from the {@param from}.
     */
    TFC.prototype.transferFrom = function (from, to, amount, sender) {
        return __awaiter(this, void 0, void 0, function () {
            var tx;
            var _this = this;
            return __generator(this, function (_a) {
                tx = this._contract.methods.transferFrom(from, to, amount.toString());
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.sendTransaction(tx, _this._address, {
                            from: sender ? sender.defaultWeb3Account : _this.defaultWeb3Account,
                        })
                            .then(function () { return resolve(); })
                            .catch(reject);
                    })];
            });
        });
    };
    /**
     * Approve one spender a certain amount of token to spend.
     *
     * @param spender Ethereum address of the spender
     * @param amount the amount of tokens to approve
     * @param sender (optional) transaction sender, the owner of the token. If omitted, use the default account.
     */
    TFC.prototype.approve = function (spender, amount, sender) {
        return __awaiter(this, void 0, void 0, function () {
            var tx;
            var _this = this;
            return __generator(this, function (_a) {
                tx = this._contract.methods.approve(spender, amount.toString());
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.sendTransaction(tx, _this._address, {
                            from: sender ? sender.defaultWeb3Account : _this.defaultWeb3Account,
                        })
                            .then(function () { return resolve(); })
                            .catch(reject);
                    })];
            });
        });
    };
    /**
     * Mint a certain amount of tokens from nowhere and put the tokens in one account.
     * The transaction sender must be the one of administrators listed by {@link TFC.adminAddresses}.
     *
     * @deprecated
     * @param to Ethereum address of the account to received the minted tokens
     * @param amount the amount of tokens to mint
     * @param sender (optional) transaction sender. If omitted, use the default account.
     */
    TFC.prototype.mint = function (to, amount, sender) {
        return __awaiter(this, void 0, void 0, function () {
            var tx;
            var _this = this;
            return __generator(this, function (_a) {
                tx = this._contract.methods.mint(to, amount.toString());
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.sendTransaction(tx, _this._address, {
                            from: sender ? sender.defaultWeb3Account : _this.defaultWeb3Account,
                        })
                            .then(function () { return resolve(); })
                            .catch(reject);
                    })];
            });
        });
    };
    /**
     * Perform a one-to-many token transfer, tokens are transferred from the sender's account to the recipients.
     *
     * @param bundledTransfer the bundled transfer recipient and amount
     * @param sender the sender who sends the transaction and whose tokens are transferred
     */
    TFC.prototype.one2manyTransfer = function (bundledTransfer, sender) {
        return __awaiter(this, void 0, void 0, function () {
            var recipients, amounts, _i, bundledTransfer_1, t, tx;
            var _this = this;
            return __generator(this, function (_a) {
                recipients = [];
                amounts = [];
                for (_i = 0, bundledTransfer_1 = bundledTransfer; _i < bundledTransfer_1.length; _i++) {
                    t = bundledTransfer_1[_i];
                    recipients.push(t.recipient);
                    amounts.push(t.amount);
                }
                tx = this._contract.methods.one2manyTransfer(recipients, amounts.map(function (a) { return a.toString(); }));
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.sendTransaction(tx, _this._address, {
                            from: sender ? sender.defaultWeb3Account : _this.defaultWeb3Account,
                        })
                            .then(function () { return resolve(); })
                            .catch(reject);
                    })];
            });
        });
    };
    return TFC;
}(Web3Wrapper_1.default));
exports.default = TFC;
//# sourceMappingURL=TFC.js.map