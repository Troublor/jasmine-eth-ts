import Web3 from "web3";
import TFC from "./TFC";
import {Address} from "./types";
import Account from "./Account";
import Web3Wrapper from "./Web3Wrapper";
import BN from "bn.js";
import fs from "fs";
import path from "path";
import Web3Core from "web3-core";

export default class SDK extends Web3Wrapper {
    constructor(ethereumEndpoint: string | Web3Core.provider) {
        super(new Web3(ethereumEndpoint));
    }

    // make it public
    public setDefaultAccount(privateKeyOrAccount: string | Account) {
        let privateKey;
        switch (typeof privateKeyOrAccount) {
            case "string":
                privateKey = privateKeyOrAccount;
                break;
            case "object":
                privateKey = privateKeyOrAccount.privateKey;
                break;
            default:
                privateKey = undefined;

        }
        super.setDefaultAccount(privateKey);
    }

    public deployTFC(initialSupply: BN, sender: Account): Promise<Address> {
        return new Promise<Address>(async (resolve, reject) => {
            let abi = JSON.parse(fs.readFileSync(path.join(__dirname, "contracts", "TFCToken.abi.json")).toString());
            let data: Buffer = fs.readFileSync(path.join(__dirname, "contracts", "TFCToken.bin"));
            let contract = new this.web3.eth.Contract(abi);
            let tx = contract.deploy({
                data: data.toString().trim(),
                arguments: [initialSupply],
            })
            this.sendTransaction(tx, undefined, {
                from: sender.defaultWeb3Account, gas: 6000000
            })
                .then(receipt => {
                    resolve(receipt.contractAddress)
                })
                .catch(reject);
        });
    }

    public getTFC(tfcAddress: Address, privateKeyOrDefaultAccount?: string | Account): TFC {
        let privateKey;
        switch (typeof privateKeyOrDefaultAccount) {
            case "string":
                privateKey = privateKeyOrDefaultAccount;
                break;
            case "object":
                privateKey = privateKeyOrDefaultAccount.privateKey;
                break;
            default:
                if (this.defaultWeb3Account) {
                    privateKey = this.defaultWeb3Account.privateKey;
                } else {
                    privateKey = undefined;
                }

        }
        return new TFC(this.web3, tfcAddress, privateKey);
    }

    public retrieveAccount(privateKey: string): Account {
        return new Account(this.web3, privateKey);
    }

    public createAccount(): Account {
        let {privateKey} = this.web3.eth.accounts.create();
        return new Account(this.web3, privateKey);
    }
}
