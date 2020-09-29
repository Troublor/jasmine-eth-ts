import Account from "../src/Account";
import Manager from "../src/Manager";
import MockEthereum from "../src/MockEthereum";
import SDK from "../src";

describe("Manager", () => {
    let accounts: Account[];
    let manager: Manager;
    let mockEth: MockEthereum;
    let sdk: SDK;

    beforeEach(async ()=>{
        mockEth = new MockEthereum();
        sdk = new SDK(mockEth.endpoint);
        accounts = mockEth.predefinedPrivateKeys.map(key => sdk.retrieveAccount(key));
        sdk.setDefaultAccount(accounts[0]);
        const address = await sdk.deployManager();
        manager = sdk.getManager(address);
    });

    it('should ', function () {

    });
});
