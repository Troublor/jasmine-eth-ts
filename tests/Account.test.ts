import { expect } from "chai";
import Account from "../src/Account";
import Web3 from "web3";
import MockEthereum from "../src/MockEthereum";

describe("Account", () => {
    let web3: Web3 | undefined;
    let predefinedPrivateKeys: string[] | undefined;

    beforeEach(() => {
        const mockEth = new MockEthereum();
        // @ts-ignore
        web3 = new Web3(mockEth.endpoint);
        predefinedPrivateKeys = mockEth.predefinedPrivateKeys;
    });

    afterEach(() => {
        web3 = undefined;
        predefinedPrivateKeys = undefined;
    });

    it('should be constructed correctly', function () {
        const account = new Account(web3 as Web3, (predefinedPrivateKeys as string[])[0]);
        expect(account.privateKey).to.be.equal((predefinedPrivateKeys as string[])[0]);
    });
});
