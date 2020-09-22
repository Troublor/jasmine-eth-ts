import {expect} from "chai";
import SDK from "../src/SDK";
import accounts from "./accounts";
import Account from "../src/Account";
import {Address} from "../src/types";
import BN from "bn.js";
import TFC from "../src/TFC";
import ganacheCore from "ganache-core";

describe("TFC", () => {
    let sdk: SDK;
    let admin: Account
    let tfcAddress: Address;
    let initialSupply = new BN(100);
    let tfc: TFC;
    let account1: Account;

    beforeEach(async () => {
        // deploy smart contract
        // @ts-ignore
        sdk = new SDK(ganacheCore.provider({
            "accounts": accounts,
            "logger": console,
        }));
        admin = sdk.retrieveAccount(accounts[0].secretKey);
        sdk.setDefaultAccount(admin);
        tfcAddress = await sdk.deployTFC(initialSupply, admin);
        tfc = sdk.getTFC(tfcAddress);
        account1 = sdk.retrieveAccount(accounts[1].secretKey);
    });

    afterEach(() => {
        sdk = undefined;
        admin = undefined;
        tfcAddress = undefined;
        tfc = undefined;
        account1 = undefined;
    })

    it('should be constructed correctly', async function () {
        let balance = await tfc.contract.methods.balanceOf(admin.address).call();
        expect(balance).to.be.equal(initialSupply.toString());
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
        let balance = await tfc.balanceOf(admin.address);
        expect(balance.toString()).to.be.equal(initialSupply.toString());
    });

    it('should be able to approve', async function () {
        await tfc.approve(account1.address, new BN(100));
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
        await tfc.transfer(account1.address, new BN(50));
        let balance = await tfc.balanceOf(admin.address);
        expect(balance.toNumber()).to.be.equal(new BN(50).toNumber())
        balance = await tfc.balanceOf(account1.address);
        expect(balance.toNumber()).to.be.equal(new BN(50).toNumber())
    });

    it('should not be able to transfer when zero balance', function (done) {
        tfc.transfer(admin.address, new BN(1), account1)
            .catch(() => {
                done();
            });
    });

    it('should be able to transferFrom', async function () {
        await tfc.approve(account1.address, new BN(100));
        await tfc.transferFrom(admin.address, account1.address, new BN(50), account1);
        let balance = await tfc.balanceOf(account1.address);
        expect(balance.toNumber()).to.be.equal(new BN(50).toNumber());
    });

    it('should not be able to transferFrom without allowance', function (done) {
        tfc.transferFrom(admin.address, account1.address, new BN(50), account1)
            .catch(()=>{
                done();
            })
    });
});
