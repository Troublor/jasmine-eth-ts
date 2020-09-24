import {expect} from "chai";
import Account from "../src/Account";
import Web3 from "web3";
import MockEthereum from "../src/MockEthereum";

describe("Account", () => {

    let web3: Web3;
    let predefinedPrivateKeys;

    beforeEach(() => {
        let mockEth = new MockEthereum();
        // @ts-ignore
        web3 = new Web3(mockEth.endpoint);
        predefinedPrivateKeys = mockEth.predefinedPrivateKeys;
    });

    afterEach(() => {
        web3 = undefined;
        predefinedPrivateKeys = undefined;
    })

    it('should be constructed correctly', function () {
        let account = new Account(web3, predefinedPrivateKeys[0]);
        expect(account.privateKey).to.be.equal(predefinedPrivateKeys[0]);
    });
})
