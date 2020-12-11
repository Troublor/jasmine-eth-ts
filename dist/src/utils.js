"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAndConvertAddress = void 0;
const web3_1 = __importDefault(require("web3"));
/**
 * Validate if a string is a valid Ethereum address.
 * If it is valid, return an {@link Address}.
 * If invalid, return null;
 *
 * @param payload the string to validate and convert
 */
function validateAndConvertAddress(payload) {
    if (web3_1.default.utils.isAddress(payload)) {
        if (!payload.startsWith("0x")) {
            payload = "0x" + payload;
        }
        return payload;
    }
    else {
        return null;
    }
}
exports.validateAndConvertAddress = validateAndConvertAddress;
//# sourceMappingURL=utils.js.map