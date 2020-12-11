"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MockEthereum_1 = __importDefault(require("../src/MockEthereum"));
const index_1 = __importDefault(require("../index"));
const bn_js_1 = __importDefault(require("bn.js"));
const chai_1 = require("chai");
describe("Manager", () => {
    let accounts;
    let manager;
    let mockEth;
    let sdk;
    let tfc;
    beforeEach(async () => {
        mockEth = new MockEthereum_1.default();
        sdk = new index_1.default(mockEth.endpoint);
        accounts = mockEth.predefinedPrivateKeys.map((key) => sdk.retrieveAccount(key));
        const address = await sdk.deployManager(accounts[0]);
        manager = sdk.getManager(address);
        tfc = sdk.getTFC(await manager.tfcAddress());
    });
    it("should be able to sign claim message", async function () {
        const [admin, user] = accounts;
        const nonce = await manager.getUnusedNonce();
        const sig = manager.signTFCClaim(user.address, new bn_js_1.default("1000000000000000000"), nonce, admin);
        chai_1.expect(sig).to.not.be.undefined;
    });
    it("should be able to do a valid TFC claim", async function () {
        const [admin, user] = accounts;
        const amount = new bn_js_1.default("1000000000000000000");
        let nonce = await manager.getUnusedNonce();
        let sig = await manager.signTFCClaim(user.address, amount, nonce, admin);
        await manager.claimTFC(amount, nonce, sig, user);
        let balance = await tfc.balanceOf(user.address);
        chai_1.expect(balance.toString()).to.be.equal(amount.toString());
        nonce = await manager.getUnusedNonce();
        sig = await manager.signTFCClaim(user.address, amount, nonce, admin);
        await manager.claimTFC(amount, nonce, sig, user);
        balance = await tfc.balanceOf(user.address);
        chai_1.expect(balance.toString()).to.be.equal(amount.mul(new bn_js_1.default(2)).toString());
    });
    it("should allow deployer to mint", async function () {
        const originalBalance = await tfc.balanceOf(accounts[0].address);
        await tfc.mint(accounts[0].address, new bn_js_1.default(100), accounts[0]);
        const balance = await tfc.balanceOf(accounts[0].address);
        chai_1.expect(originalBalance.add(new bn_js_1.default(100)).toString()).to.be.equal(balance.toString());
    });
});
//# sourceMappingURL=Manager.test.js.map