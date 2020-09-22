import {Address} from "./types";
import Web3Wrapper from "./Web3Wrapper";
import Web3 from "web3";
import TFC from "./TFC";

export default class Account extends Web3Wrapper {
    constructor(web3: Web3, privateKey: string) {
        super(web3, privateKey);
    }

    get address(): Address {
        return this.defaultAccount.address
    }

    get privateKey(): string {
        return this.defaultAccount.privateKey;
    }

    public getTFC(tfcAddress: Address): TFC {
        return new TFC(this.web3, tfcAddress, this.privateKey);
    }
}
