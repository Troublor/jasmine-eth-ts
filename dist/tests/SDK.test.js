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
        const mockEth = new MockEthereum_1.default();
        // @ts-ignore
        sdk = new SDK_1.default(mockEth.endpoint);
        predefinedPrivateKeys = mockEth.predefinedPrivateKeys;
    });
    afterEach(() => {
        // @ts-ignore
        sdk = undefined;
        // @ts-ignore
        predefinedPrivateKeys = undefined;
    });
    it('should be constructed correctly', function () {
        chai_1.expect(sdk).not.to.be.undefined;
    });
    it('should be able to create account', function () {
        const account = sdk.createAccount();
        chai_1.expect(sdk.web3.eth.accounts.privateKeyToAccount(account.privateKey).address).to.be.equal(account.address);
    });
    it('should retrieve account correctly', function () {
        const account = sdk.createAccount();
        const retrieved = sdk.retrieveAccount(account.privateKey);
        chai_1.expect(retrieved.address).to.be.equal(account.address);
    });
    it('should be able to deploy TFC', async function () {
        const holders = predefinedPrivateKeys.map((key) => sdk.retrieveAccount(key)).slice(0, 20);
        const tfcAddress = await sdk.deployTFC(holders[0]);
        const code = await sdk.web3.eth.getCode(tfcAddress);
        chai_1.expect(code).to.not.be.undefined;
        const tfc = sdk.getTFC(tfcAddress);
        const totalSupply = await tfc.totalSupply();
        chai_1.expect(totalSupply.toNumber()).to.be.equal(0);
    });
    it('should be able to deploy TFCManager', async function () {
        const admin = sdk.retrieveAccount(predefinedPrivateKeys[0]);
        const managerAddress = await sdk.deployManager(admin);
        const code = await sdk.web3.eth.getCode(managerAddress);
        chai_1.expect(code).to.not.be.undefined;
    });
    it('should convert ether to wei correctly', function () {
        chai_1.expect(sdk.ether2wei(new bn_js_1.default('1')).toString()).to.be.equal(new bn_js_1.default("1000000000000000000").toString());
    });
    it('should convert wei to ether correctly', function () {
        chai_1.expect(sdk.wei2ether(new bn_js_1.default('1000000000000000000')).toString()).to.be.equal(new bn_js_1.default("1").toString());
    });
    it('should get ether balance correctly', async function () {
        for (const key of predefinedPrivateKeys) {
            const balance = await sdk.balanceOf(sdk.retrieveAccount(key).address);
            chai_1.expect(balance.toString()).to.be.equal(new bn_js_1.default("1000000000000000000").mul(new bn_js_1.default(100)).toString()); // 100 ether for predefined accounts
        }
    });
    it('should transfer ether correctly', async function () {
        const from = sdk.retrieveAccount(predefinedPrivateKeys[0]);
        const to = sdk.createAccount();
        let balance = await sdk.balanceOf(to.address);
        chai_1.expect(balance.toString()).to.be.equal(sdk.ether2wei(new bn_js_1.default(0)).toString());
        await sdk.transfer(to.address, sdk.ether2wei(new bn_js_1.default(1)).div(new bn_js_1.default(2)), from);
        balance = await sdk.balanceOf(to.address);
        chai_1.expect(balance.toString()).to.be.equal(sdk.ether2wei(new bn_js_1.default(1)).div(new bn_js_1.default(2)).toString());
    });
});
//# sourceMappingURL=SDK.test.js.map