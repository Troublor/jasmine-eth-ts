import Account from "../src/Account";
import Manager from "../src/Manager";
import MockEthereum from "../src/MockEthereum";
import SDK, { TFC } from "../index";
import BN from "bn.js";
import { expect } from "chai";
import Web3Core from "web3-core";

describe("Manager", () => {
    let accounts: Account[];
    let manager: Manager;
    let mockEth: MockEthereum;
    let sdk: SDK;
    let tfc: TFC;

    beforeEach(async () => {
        mockEth = new MockEthereum();
        sdk = new SDK((mockEth.endpoint as unknown) as Web3Core.provider);
        accounts = mockEth.predefinedPrivateKeys.map((key) => sdk.retrieveAccount(key));
        const address = await sdk.deployManager(accounts[0]);
        manager = sdk.getManager(address);
        tfc = sdk.getTFC(await manager.tfcAddress());
    });

    it('should be able to sign claim message', async function () {
        const [admin, user] = accounts;
        const nonce = await manager.getUnusedNonce();
        const sig = manager.signTFCClaim(user.address, new BN("1000000000000000000"), nonce, admin);
        expect(sig).to.not.be.undefined;
    });

    it('should be able to do a valid TFC claim', async function () {
        const [admin, user] = accounts;
        const amount = new BN("1000000000000000000");
        let nonce = await manager.getUnusedNonce();
        let sig = await manager.signTFCClaim(user.address, amount, nonce, admin);
        await manager.claimTFC(amount, nonce, sig, user);
        let balance = await tfc.balanceOf(user.address);
        expect(balance.toString()).to.be.equal(amount.toString());

        nonce = await manager.getUnusedNonce();
        sig = await manager.signTFCClaim(user.address, amount, nonce, admin);
        await manager.claimTFC(amount, nonce, sig, user);
        balance = await tfc.balanceOf(user.address);
        expect(balance.toString()).to.be.equal(amount.mul(new BN(2)).toString());
    });

    it('should allow deployer to mint', async function () {
        const originalBalance = await tfc.balanceOf(accounts[0].address);
        await tfc.mint(accounts[0].address, new BN(100), accounts[0]);
        const balance = await tfc.balanceOf(accounts[0].address);
        expect(originalBalance.add(new BN(100)).toString()).to.be.equal(balance.toString());
    });
});
