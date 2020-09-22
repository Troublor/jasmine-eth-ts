import Web3 from "web3";
import TFC from "./TFC";
import {Address} from "./types";
import Account from "./Account";
import Web3Wrapper from "./Web3Wrapper";

export default class SDK extends Web3Wrapper {
    constructor(ethereumEndpoint: string) {
        super(new Web3(ethereumEndpoint));
    }

    // make it public
    public setDefaultAccount(privateKey: string) {
        super.setDefaultAccount(privateKey);
    }

    public getTFC(tfcAddress: Address): TFC {
        return new TFC(this.web3, tfcAddress);
    }

    public getAccount(privateKey: string): Account {
        return new Account(this.web3, privateKey);
    }

    public createAccount(): Account {
        let {privateKey} = this.web3.eth.accounts.create();
        return new Account(this.web3, privateKey);
    }
}
