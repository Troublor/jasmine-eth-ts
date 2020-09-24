"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockEthereum = exports.TFC = exports.Account = exports.SDK = void 0;
var SDK_1 = __importDefault(require("./SDK"));
exports.SDK = SDK_1.default;
var Account_1 = __importDefault(require("./Account"));
exports.Account = Account_1.default;
var TFC_1 = __importDefault(require("./TFC"));
exports.TFC = TFC_1.default;
var MockEthereum_1 = __importDefault(require("./MockEthereum"));
exports.MockEthereum = MockEthereum_1.default;
__exportStar(require("./types"), exports);
exports.default = SDK_1.default;
// module.exports = SDK
//# sourceMappingURL=index.js.map