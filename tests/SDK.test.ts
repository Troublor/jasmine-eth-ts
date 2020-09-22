import {expect} from "chai";
import SDK from "../src/SDK";
import BN from "bn.js";
import ganacheCore from "ganache-core";
import accounts from "./accounts";

describe("SDK", () => {

    let sdk: SDK;

    beforeEach(() => {
        // @ts-ignore
        sdk = new SDK(ganacheCore.provider({
            "accounts": accounts,
            "logger": console,
        }));
    });

    afterEach(() => {
        sdk = undefined;
    })

    it('should be constructed correctly', function () {
        expect(sdk.defaultAccountAddress).to.be.undefined;
    });

    it('should be able to create account', function () {
        let account = sdk.createAccount();
        console.log(account.address);
        console.log(account.privateKey);
        expect(sdk.web3.eth.accounts.privateKeyToAccount(account.privateKey).address).to.be.equal(account.address);
    });

    it('should be able to set default account', function () {
        let account = sdk.createAccount();
        expect(sdk.defaultAccountAddress).to.be.undefined;
        sdk.setDefaultAccount(account);
        expect(sdk.defaultAccountAddress).to.be.equal(account.address);
        sdk.setDefaultAccount(account.privateKey);
        expect(sdk.defaultAccountAddress).to.be.equal(account.address);
    });

    it('should retrieve account correctly', function () {
        let account = sdk.createAccount();
        let retrieved = sdk.retrieveAccount(account.privateKey);
        expect(retrieved.address).to.be.equal(account.address);
    });

    it('should be able to deploy TFC', async function () {
        let account = sdk.retrieveAccount(accounts[0].secretKey);
        let tfcAddress = await sdk.deployTFC(new BN(100), account);
        let code = await sdk.web3.eth.getCode(tfcAddress);
        expect(code).to.not.be.undefined;
    });

    it('should be able to create TFC instance', async function () {
        let account = sdk.retrieveAccount(accounts[0].secretKey);
        let initialSupply = new BN(100);
        let tfcAddress = await sdk.deployTFC(initialSupply, account);
        let tfc = sdk.getTFC(tfcAddress, account);
        let balance = await tfc.contract.methods.balanceOf(account.address).call();
        expect(balance).to.be.equal(initialSupply.toString());
    });
})
