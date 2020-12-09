"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const Account_1 = __importDefault(require("../src/Account"));
const web3_1 = __importDefault(require("web3"));
const MockEthereum_1 = __importDefault(require("../src/MockEthereum"));
describe("Account", () => {
    let web3;
    let predefinedPrivateKeys;
    beforeEach(() => {
        const mockEth = new MockEthereum_1.default();
        // @ts-ignore
        web3 = new web3_1.default(mockEth.endpoint);
        predefinedPrivateKeys = mockEth.predefinedPrivateKeys;
    });
    afterEach(() => {
        web3 = undefined;
        predefinedPrivateKeys = undefined;
    });
    it('should be constructed correctly', function () {
        const account = new Account_1.default(web3, predefinedPrivateKeys[0]);
        chai_1.expect(account.privateKey).to.be.equal(predefinedPrivateKeys[0]);
    });
});
//# sourceMappingURL=Account.test.js.map