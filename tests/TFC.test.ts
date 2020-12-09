import {expect} from "chai";
import SDK from "../src/SDK";
import Account from "../src/Account";
import {Address} from "../index";
import BN from "bn.js";
import TFC from "../src/TFC";
import MockEthereum from "../src/MockEthereum";
import Web3Core from "web3-core";

describe("TFC", function () {
    this.timeout(5000);
    let sdk: SDK;
    let admin: Account
    let tfcAddress: Address;
    let initialSupply = new BN(20).mul(new BN('100000000').mul(new BN('1000000000000000000')));
    let tfc: TFC;
    let account1: Account;
    let accounts: Account[];

    beforeEach(async () => {
        // deploy smart contract
        // @ts-ignore
        let mockEth = new MockEthereum();
        sdk = new SDK(mockEth.endpoint as unknown as Web3Core.provider);
        accounts = mockEth.predefinedPrivateKeys.map(key => sdk.retrieveAccount(key));
        admin = accounts[0];
        tfcAddress = await sdk.deployTFC(admin);
        tfc = sdk.getTFC(tfcAddress);
        account1 = accounts[1];
        // make initial supply
        for (const acc of accounts.slice(0, 20)) {
            await tfc.mint(acc.address, new BN('100000000').mul(new BN('1000000000000000000')), admin);
        }
    });

    afterEach(() => {
        // @ts-ignore
        sdk = undefined;
        // @ts-ignore
        admin = undefined;
        // @ts-ignore
        tfcAddress = undefined;
        // @ts-ignore
        tfc = undefined;
        // @ts-ignore
        account1 = undefined;
        // @ts-ignore
        accounts = undefined;
    })

    it('should be constructed correctly', async function () {
        let balance = await tfc.contract.methods.balanceOf(account1.address).call();
        expect(balance).to.be.equal(initialSupply.div(new BN(20)).toString());
    });

    it('should return correct name', async function () {
        let name = await tfc.name();
        expect(name).to.be.equal("TFCToken");
    });

    it('should return correct symbol', async function () {
        let symbol = await tfc.symbol();
        expect(symbol).to.be.equal("TFC");
    });

    it('should return correct decimals', async function () {
        let decimals = await tfc.decimals();
        expect(decimals).to.be.equal(18);
    });

    it('should return correct initial supply', async function () {
        let totalSupply = await tfc.totalSupply();
        expect(totalSupply.toString()).to.be.equal(initialSupply.toString());
    });

    it('should return default no allowance', async function () {
        let allowance = await tfc.allowance(admin.address, account1.address);
        expect(allowance.toString()).to.be.equal(new BN(0).toString());
    });

    it('should return correct balance of admin', async function () {
        let balance = await tfc.balanceOf(account1.address);
        expect(balance.toString()).to.be.equal(initialSupply.div(new BN(20)).toString());
    });

    it('should be able to approve', async function () {
        await tfc.approve(account1.address, new BN(100), admin);
        let allowance = await tfc.allowance(admin.address, account1.address);
        expect(allowance.toString()).to.be.equal(new BN(100).toString());
    });

    it('should be able to approve using different account', async function () {
        await tfc.approve(admin.address, new BN(100), account1);
        let allowance = await tfc.allowance(admin.address, account1.address);
        expect(allowance.toString()).to.be.equal(new BN(0).toString());
        allowance = await tfc.allowance(account1.address, admin.address);
        expect(allowance.toString()).to.be.equal(new BN(100).toString());
    });

    it('should be able to transfer', async function () {
        let originalBalanceAdmin = await tfc.balanceOf(admin.address);
        let originalBalanceAccount1 = await tfc.balanceOf(admin.address);
        await tfc.transfer(account1.address, new BN(50), admin);
        let balance = await tfc.balanceOf(admin.address);
        expect(balance.toString()).to.be.equal(originalBalanceAdmin.sub(new BN(50)).toString())
        balance = await tfc.balanceOf(account1.address);
        expect(balance.toString()).to.be.equal(originalBalanceAccount1.add(new BN(50)).toString());
    });

    it('should not be able to transfer when zero balance', function (done) {
        tfc.transfer(admin.address, new BN(1), accounts[20])
            .catch(() => {
                done();
            });
    });

    it('should be able to transferFrom', async function () {
        let originalBalanceAccount1 = await tfc.balanceOf(admin.address);
        await tfc.approve(account1.address, new BN(100), admin);
        await tfc.transferFrom(admin.address, account1.address, new BN(50), account1);
        let balance = await tfc.balanceOf(account1.address);
        expect(balance.toString()).to.be.equal(originalBalanceAccount1.add(new BN(50)).toString());
    });

    it('should not be able to transferFrom without allowance', function (done) {
        tfc.transferFrom(admin.address, account1.address, new BN(50), account1)
            .catch(() => {
                done();
            })
    });

    it('should be able to mint', async function () {
        let originalBalanceAccount1 = await tfc.balanceOf(admin.address);
        await tfc.mint(account1.address, new BN(100), admin);
        let balance = await tfc.balanceOf(account1.address);
        expect(balance.toString()).to.be.equal(originalBalanceAccount1.add(new BN(100)).toString());
    });

    it('should not be able to mint without minter role', function (done) {
        tfc.mint(account1.address, new BN(100), account1)
            .catch(() => {
                done();
            })
    });

    it('should be able to list admin addresses', async function () {
        let admins = await tfc.adminAddresses();
        expect(admins).to.be.lengthOf(1);
        expect(admins[0]).to.be.equal(admin.address);
    });

    it('should be able to check if it can mint', async function () {
        expect(
            await tfc.canMint(admin)
        ).to.be.true;
        expect(
            await tfc.canMint(account1)
        ).to.be.false;
    });

    it('should be able to do one-to-many transfer', async function () {
        let amount = new BN("10000000").mul(new BN("1000000000000000000"));
        let bundled = [];
        for (let i = 0; i < 10; i++) {
            bundled.push({
                recipient: accounts[20 + i].address,
                amount: amount,
            });
        }
        await tfc.one2manyTransfer(bundled, admin);
        let balance = await tfc.balanceOf(admin.address);
        expect(balance.toString()).to.be.equal(new BN(0).toString());
        for (let i = 0; i < 10; i++) {
            let balance = await tfc.balanceOf(accounts[20 + i].address);
            expect(balance.toString()).to.be.equal(amount.toString());
        }
    });
});
