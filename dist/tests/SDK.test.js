"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const SDK_1 = __importDefault(require("../src/SDK"));
const bn_js_1 = __importDefault(require("bn.js"));
const MockEthereum_1 = __importDefault(require("../src/MockEthereum"));
describe("SDK", () => {
    let sdk;
    let predefinedPrivateKeys;
    beforeEach(() => {
        let mockEth = new MockEthereum_1.default();
        // @ts-ignore
        sdk = new SDK_1.default(mockEth.endpoint);
        predefinedPrivateKeys = mockEth.predefinedPrivateKeys;
    });
    afterEach(() => {
        sdk = undefined;
        predefinedPrivateKeys = undefined;
    });
    it('should be constructed correctly', function () {
        chai_1.expect(sdk.defaultAccountAddress).to.be.undefined;
    });
    it('should be able to create account', function () {
        let account = sdk.createAccount();
        chai_1.expect(sdk.web3.eth.accounts.privateKeyToAccount(account.privateKey).address).to.be.equal(account.address);
    });
    it('should be able to set default account', function () {
        let account = sdk.createAccount();
        chai_1.expect(sdk.defaultAccountAddress).to.be.undefined;
        sdk.setDefaultAccount(account);
        chai_1.expect(sdk.defaultAccountAddress).to.be.equal(account.address);
        sdk.setDefaultAccount(account.privateKey);
        chai_1.expect(sdk.defaultAccountAddress).to.be.equal(account.address);
    });
    it('should retrieve account correctly', function () {
        let account = sdk.createAccount();
        let retrieved = sdk.retrieveAccount(account.privateKey);
        chai_1.expect(retrieved.address).to.be.equal(account.address);
    });
    it('should be able to deploy TFC', async function () {
        let holders = predefinedPrivateKeys.map(key => sdk.retrieveAccount(key)).slice(0, 20);
        let tfcAddress = await sdk.deployTFC(holders, holders[0]);
        let code = await sdk.web3.eth.getCode(tfcAddress);
        chai_1.expect(code).to.not.be.undefined;
        let tfc = sdk.getTFC(tfcAddress);
        for (let holder of holders) {
            let balance = await tfc.balanceOf(holder.address);
            chai_1.expect(balance.toString()).to.be.equal(new bn_js_1.default('100000000', 10).mul(new bn_js_1.default('1000000000000000000', 10)).toString());
        }
        let totalSupply = await tfc.totalSupply();
        chai_1.expect(totalSupply.toString()).to.be.equal(new bn_js_1.default(20).mul(new bn_js_1.default('100000000', 10).mul(new bn_js_1.default('1000000000000000000', 10))).toString());
    });
    it('should be able to deploy TFCManager', async function () {
        let admin = sdk.retrieveAccount(predefinedPrivateKeys[0]);
        sdk.setDefaultAccount(admin);
        let managerAddress = await sdk.deployManager();
        let code = await sdk.web3.eth.getCode(managerAddress);
        chai_1.expect(code).to.not.be.undefined;
    });
    it('should convert ether to wei correctly', function () {
        chai_1.expect(sdk.ether2wei(new bn_js_1.default("1")).toString()).to.be.equal(new bn_js_1.default("1000000000000000000").toString());
    });
    it('should convert wei to ether correctly', function () {
        chai_1.expect(sdk.wei2ether(new bn_js_1.default("1000000000000000000")).toString()).to.be.equal(new bn_js_1.default("1").toString());
    });
    it('should get ether balance correctly', async function () {
        for (let key of predefinedPrivateKeys) {
            let balance = await sdk.balanceOf(sdk.retrieveAccount(key).address);
            chai_1.expect(balance.toString()).to.be.equal(new bn_js_1.default("1000000000000000000").mul(new bn_js_1.default(100)).toString()); // 100 ether for predefined accounts
        }
    });
    it('should transfer ether correctly', async function () {
        let from = sdk.retrieveAccount(predefinedPrivateKeys[0]);
        let to = sdk.createAccount();
        let balance = await sdk.balanceOf(to.address);
        chai_1.expect(balance.toString()).to.be.equal(sdk.ether2wei(new bn_js_1.default(0)).toString());
        await sdk.transfer(to.address, sdk.ether2wei(new bn_js_1.default(1)).div(new bn_js_1.default(2)), from);
        balance = await sdk.balanceOf(to.address);
        chai_1.expect(balance.toString()).to.be.equal(sdk.ether2wei(new bn_js_1.default(1)).div(new bn_js_1.default(2)).toString());
    });
});
//# sourceMappingURL=SDK.test.js.map