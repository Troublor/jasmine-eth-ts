import Web3 from "web3";
import TFC from "./TFC";
import {Address} from "./types";
import Account from "./Account";
import Web3Wrapper from "./Web3Wrapper";
import BN from "bn.js";
import fs from "fs";
import path from "path";
import Web3Core from "web3-core";

/**
 * SDK class for jasmine ethereum client.
 */
export default class SDK extends Web3Wrapper {
    /**
     * Construct SDK object using ethereum endpoint.
     * Ethereum endpoint can be a url (e.g. http://localhost:8545) or a web3.js-compatible provider
     *
     * @param ethereumEndpoint url or web3.js provider
     */
    constructor(ethereumEndpoint: string | Web3Core.provider) {
        super(new Web3(ethereumEndpoint));
    }

    /**
     * Set the default account of this SDK.
     *
     * @param privateKeyOrAccount private key string or an object of {@link Account}
     */
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

    /**
     * Deploy TFC ERC20 contract on the underling blockchain.
     *
     * @param initialSupply the initial token supply
     * @param sender the account used to the contract (who will become admin)
     */
    public deployTFC(initialSupply: BN, sender?: Account): Promise<Address> {
        return new Promise<Address>(async (resolve, reject) => {
            let abi = JSON.parse(fs.readFileSync(path.join(__dirname, "contracts", "TFCToken.abi.json")).toString());
            let data: Buffer = fs.readFileSync(path.join(__dirname, "contracts", "TFCToken.bin"));
            let contract = new this.web3.eth.Contract(abi);
            let tx = contract.deploy({
                data: data.toString().trim(),
                arguments: [initialSupply],
            })
            this.sendTransaction(tx, undefined, {
                from: sender ? sender.defaultWeb3Account : this.defaultWeb3Account,
                gas: 6000000
            })
                .then(receipt => {
                    resolve(receipt.contractAddress)
                })
                .catch(reject);
        });
    }

    /**
     * Get the {@link TFC} instance.
     *
     * @param tfcAddress the address of the smart contract of {@link TFC}
     * @param privateKeyOrDefaultAccount the private key or account object of the default account
     * used to send transactions in the TFC instance.
     */
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

    /**
     * Retrieve an account using private key.
     *
     * @param privateKey
     */
    public retrieveAccount(privateKey: string): Account {
        return new Account(this.web3, privateKey);
    }

    /**
     * Create a new account.
     * Be sure to appropriately save the private key of the account to be able to retrieve next time.
     */
    public createAccount(): Account {
        let {privateKey} = this.web3.eth.accounts.create();
        return new Account(this.web3, privateKey);
    }
}
