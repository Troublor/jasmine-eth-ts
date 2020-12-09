import {expect} from "chai";
import SDK from "../src/SDK";
import BN from "bn.js";
import MockEthereum from "../src/MockEthereum";

describe("SDK", () => {

    let sdk: SDK;
    let predefinedPrivateKeys : string[];

    beforeEach(() => {
        let mockEth = new MockEthereum();
        // @ts-ignore
        sdk = new SDK(mockEth.endpoint);
        predefinedPrivateKeys = mockEth.predefinedPrivateKeys;
    });

    afterEach(() => {
        // @ts-ignore
        sdk = undefined;
        // @ts-ignore
        predefinedPrivateKeys = undefined;
    })

    it('should be constructed correctly', function () {
        expect(sdk).not.to.be.undefined;
    });

    it('should be able to create account', function () {
        let account = sdk.createAccount();
        expect(sdk.web3.eth.accounts.privateKeyToAccount(account.privateKey).address).to.be.equal(account.address);
    });

    it('should retrieve account correctly', function () {
        let account = sdk.createAccount();
        let retrieved = sdk.retrieveAccount(account.privateKey);
        expect(retrieved.address).to.be.equal(account.address);
    });

    it('should be able to deploy TFC', async function () {
        let holders = predefinedPrivateKeys.map(key => sdk.retrieveAccount(key)).slice(0, 20);
        let tfcAddress = await sdk.deployTFC(holders[0]);
        let code = await sdk.web3.eth.getCode(tfcAddress);
        expect(code).to.not.be.undefined;
        let tfc = sdk.getTFC(tfcAddress);
        let totalSupply = await tfc.totalSupply();
        expect(totalSupply.toNumber()).to.be.equal(0);
    });

    it('should be able to deploy TFCManager', async function () {
        let admin = sdk.retrieveAccount(predefinedPrivateKeys[0]);
        let managerAddress = await sdk.deployManager(admin);
        let code = await sdk.web3.eth.getCode(managerAddress);
        expect(code).to.not.be.undefined;
    });

    it('should convert ether to wei correctly', function () {
        expect(
            sdk.ether2wei(new BN("1")).toString()
        ).to.be.equal(new BN("1000000000000000000").toString());
    });

    it('should convert wei to ether correctly', function () {
        expect(
            sdk.wei2ether(new BN("1000000000000000000")).toString()
        ).to.be.equal(new BN("1").toString());
    });

    it('should get ether balance correctly', async function () {
        for (let key of predefinedPrivateKeys) {
            let balance = await sdk.balanceOf(sdk.retrieveAccount(key).address);
            expect(balance.toString()).to.be.equal(new BN("1000000000000000000").mul(new BN(100)).toString()); // 100 ether for predefined accounts
        }
    });

    it('should transfer ether correctly', async function () {
        let from = sdk.retrieveAccount(predefinedPrivateKeys[0]);
        let to = sdk.createAccount();
        let balance = await sdk.balanceOf(to.address);
        expect(balance.toString()).to.be.equal(sdk.ether2wei(new BN(0)).toString());
        await sdk.transfer(to.address, sdk.ether2wei(new BN(1)).div(new BN(2)), from);
        balance = await sdk.balanceOf(to.address);
        expect(balance.toString()).to.be.equal(sdk.ether2wei(new BN(1)).div(new BN(2)).toString());
    });
})
