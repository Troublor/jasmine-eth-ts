import {expect} from "chai";
import SDK from "../src/SDK";
import BN from "bn.js";
import MockEthereum from "../src/MockEthereum";

describe("SDK", () => {

    let sdk: SDK;
    let predefinedPrivateKeys;

    beforeEach(() => {
        let mockEth = new MockEthereum();
        // @ts-ignore
        sdk = new SDK(mockEth.endpoint);
        predefinedPrivateKeys = mockEth.predefinedPrivateKeys;
    });

    afterEach(() => {
        sdk = undefined;
        predefinedPrivateKeys = undefined;
    })

    it('should be constructed correctly', function () {
        expect(sdk.defaultAccountAddress).to.be.undefined;
    });

    it('should be able to create account', function () {
        let account = sdk.createAccount();
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
        let holders = predefinedPrivateKeys.map(key => sdk.retrieveAccount(key)).slice(0, 20);
        let tfcAddress = await sdk.deployTFC(holders, holders[0]);
        let code = await sdk.web3.eth.getCode(tfcAddress);
        expect(code).to.not.be.undefined;
        let tfc = sdk.getTFC(tfcAddress);
        for (let holder of holders) {
            let balance = await tfc.balanceOf(holder.address);
            expect(balance.toString()).to.be.equal(new BN('100000000', 10).mul(new BN('1000000000000000000', 10)).toString());
        }
        let totalSupply = await tfc.totalSupply();
        expect(totalSupply.toString()).to.be.equal(new BN(20).mul(new BN('100000000', 10).mul(new BN('1000000000000000000', 10))).toString());
    });
})
