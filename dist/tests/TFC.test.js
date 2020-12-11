"use strict";
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const SDK_1 = __importDefault(require("../src/SDK"));
const bn_js_1 = __importDefault(require("bn.js"));
const MockEthereum_1 = __importDefault(require("../src/MockEthereum"));
describe("TFC", function () {
    this.timeout(5000);
    let sdk;
    let admin;
    let tfcAddress;
    const initialSupply = new bn_js_1.default(20).mul(
        new bn_js_1.default("100000000").mul(new bn_js_1.default("1000000000000000000")),
    );
    let tfc;
    let account1;
    let accounts;
    beforeEach(async () => {
        // deploy smart contract
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const mockEth = new MockEthereum_1.default();
        sdk = new SDK_1.default(mockEth.endpoint);
        accounts = mockEth.predefinedPrivateKeys.map((key) => sdk.retrieveAccount(key));
        admin = accounts[0];
        tfcAddress = await sdk.deployTFC(admin);
        tfc = sdk.getTFC(tfcAddress);
        account1 = accounts[1];
        // make initial supply
        for (const acc of accounts.slice(0, 20)) {
            await tfc.mint(
                acc.address,
                new bn_js_1.default("100000000").mul(new bn_js_1.default("1000000000000000000")),
                admin,
            );
        }
    });
    afterEach(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        sdk = undefined;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        admin = undefined;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        tfcAddress = undefined;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        tfc = undefined;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        account1 = undefined;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        accounts = undefined;
    });
    it("should be constructed correctly", async function () {
        const balance = await tfc.contract.methods.balanceOf(account1.address).call();
        chai_1.expect(balance).to.be.equal(initialSupply.div(new bn_js_1.default(20)).toString());
    });
    it("should return correct name", async function () {
        const name = await tfc.name();
        chai_1.expect(name).to.be.equal("TFCToken");
    });
    it("should return correct symbol", async function () {
        const symbol = await tfc.symbol();
        chai_1.expect(symbol).to.be.equal("TFC");
    });
    it("should return correct decimals", async function () {
        const decimals = await tfc.decimals();
        chai_1.expect(decimals).to.be.equal(18);
    });
    it("should return correct initial supply", async function () {
        const totalSupply = await tfc.totalSupply();
        chai_1.expect(totalSupply.toString()).to.be.equal(initialSupply.toString());
    });
    it("should return default no allowance", async function () {
        const allowance = await tfc.allowance(admin.address, account1.address);
        chai_1.expect(allowance.toString()).to.be.equal(new bn_js_1.default(0).toString());
    });
    it("should return correct balance of admin", async function () {
        const balance = await tfc.balanceOf(account1.address);
        chai_1.expect(balance.toString()).to.be.equal(initialSupply.div(new bn_js_1.default(20)).toString());
    });
    it("should be able to approve", async function () {
        await tfc.approve(account1.address, new bn_js_1.default(100), admin);
        const allowance = await tfc.allowance(admin.address, account1.address);
        chai_1.expect(allowance.toString()).to.be.equal(new bn_js_1.default(100).toString());
    });
    it("should be able to approve using different account", async function () {
        await tfc.approve(admin.address, new bn_js_1.default(100), account1);
        let allowance = await tfc.allowance(admin.address, account1.address);
        chai_1.expect(allowance.toString()).to.be.equal(new bn_js_1.default(0).toString());
        allowance = await tfc.allowance(account1.address, admin.address);
        chai_1.expect(allowance.toString()).to.be.equal(new bn_js_1.default(100).toString());
    });
    it("should be able to transfer", async function () {
        const originalBalanceAdmin = await tfc.balanceOf(admin.address);
        const originalBalanceAccount1 = await tfc.balanceOf(admin.address);
        await tfc.transfer(account1.address, new bn_js_1.default(50), admin);
        let balance = await tfc.balanceOf(admin.address);
        chai_1.expect(balance.toString()).to.be.equal(originalBalanceAdmin.sub(new bn_js_1.default(50)).toString());
        balance = await tfc.balanceOf(account1.address);
        chai_1.expect(balance.toString()).to.be.equal(originalBalanceAccount1.add(new bn_js_1.default(50)).toString());
    });
    it("should not be able to transfer when zero balance", function (done) {
        tfc.transfer(admin.address, new bn_js_1.default(1), accounts[20]).catch(() => {
            done();
        });
    });
    it("should be able to transferFrom", async function () {
        const originalBalanceAccount1 = await tfc.balanceOf(admin.address);
        await tfc.approve(account1.address, new bn_js_1.default(100), admin);
        await tfc.transferFrom(admin.address, account1.address, new bn_js_1.default(50), account1);
        const balance = await tfc.balanceOf(account1.address);
        chai_1.expect(balance.toString()).to.be.equal(originalBalanceAccount1.add(new bn_js_1.default(50)).toString());
    });
    it("should not be able to transferFrom without allowance", function (done) {
        tfc.transferFrom(admin.address, account1.address, new bn_js_1.default(50), account1).catch(() => {
            done();
        });
    });
    it("should be able to mint", async function () {
        const originalBalanceAccount1 = await tfc.balanceOf(admin.address);
        await tfc.mint(account1.address, new bn_js_1.default(100), admin);
        const balance = await tfc.balanceOf(account1.address);
        chai_1.expect(balance.toString()).to.be.equal(originalBalanceAccount1.add(new bn_js_1.default(100)).toString());
    });
    it("should not be able to mint without minter role", function (done) {
        tfc.mint(account1.address, new bn_js_1.default(100), account1).catch(() => {
            done();
        });
    });
    it("should be able to list admin addresses", async function () {
        const admins = await tfc.adminAddresses();
        chai_1.expect(admins).to.be.lengthOf(1);
        chai_1.expect(admins[0]).to.be.equal(admin.address);
    });
    it("should be able to check if it can mint", async function () {
        chai_1.expect(await tfc.canMint(admin)).to.be.true;
        chai_1.expect(await tfc.canMint(account1)).to.be.false;
    });
    it("should be able to do one-to-many transfer", async function () {
        const amount = new bn_js_1.default("10000000").mul(new bn_js_1.default("1000000000000000000"));
        const bundled = [];
        for (let i = 0; i < 10; i++) {
            bundled.push({
                recipient: accounts[20 + i].address,
                amount: amount,
            });
        }
        await tfc.one2manyTransfer(bundled, admin);
        const balance = await tfc.balanceOf(admin.address);
        chai_1.expect(balance.toString()).to.be.equal(new bn_js_1.default(0).toString());
        for (let i = 0; i < 10; i++) {
            const balance = await tfc.balanceOf(accounts[20 + i].address);
            chai_1.expect(balance.toString()).to.be.equal(amount.toString());
        }
    });
});
//# sourceMappingURL=TFC.test.js.map
