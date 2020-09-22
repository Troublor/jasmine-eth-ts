import {expect} from "chai";
import ganacheCore from "ganache-core";
import accounts from "./accounts";
import Account from "../src/Account";
import Web3 from "web3";

describe("Account", () => {

    let web3: Web3;

    beforeEach(() => {
        // @ts-ignore
        web3 = new Web3(ganacheCore.provider({
            accounts: accounts
        }))
    });

    afterEach(() => {
        web3 = undefined;
    })

    it('should be constructed correctly', function () {
        let account = new Account(web3, accounts[0].secretKey);
        expect(account.privateKey).to.be.equal(accounts[0].secretKey);
    });
})
