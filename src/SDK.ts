import Web3 from "web3";
import TFC from "./TFC";
import { Address } from "./types";
import Account from "./Account";
import Web3Wrapper from "./Web3Wrapper";
import BN from "bn.js";
import fs from "fs";
import path from "path";
import Web3Core from "web3-core";
import Manager from "./Manager";
import { ContractSendMethod } from "web3-eth-contract";
import { PayableTransactionObject, NonPayableTransactionObject } from "./contracts/types";
import { Version, versionNum, versionStr } from "./version";

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
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        super(new Web3(ethereumEndpoint));
    }

    public get version(): Version {
        return {
            versionStr: versionStr(),
            versionNum: versionNum(),
        };
    }

    /**
     * Deploy TFC ERC20 contract on the underling blockchain.
     *
     * @param sender the transaction sender who creates the contract
     */
    public deployTFC(sender: Account): Promise<Address> {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise<Address>(async (resolve, reject) => {
            const abi = JSON.parse(fs.readFileSync(path.join(__dirname, "contracts", "TFCToken.abi.json")).toString());
            const data: Buffer = fs.readFileSync(path.join(__dirname, "contracts", "TFCToken.bin"));
            const contract = new this.web3.eth.Contract(abi);
            const tx = contract.deploy({
                data: data.toString().trim(),
                arguments: [sender.address, sender.address],
            });
            this.sendTransaction(
                tx as
                    | ContractSendMethod
                    | PayableTransactionObject<any>
                    | NonPayableTransactionObject<any>
                    | Web3Core.TransactionConfig,
                undefined,
                {
                    from: sender.web3Account,
                    gas: 6000000,
                },
            )
                .then((receipt) => {
                    resolve(receipt.contractAddress as Address);
                })
                .catch(reject);
        });
    }

    /**
     * Deploy TFCManager contract on the underling blockchain.
     * The TFCManager contract will automatically deploy a TFC ERC20 contract and provides TFC claim service for users.
     *
     * @param sender the account used to deploy
     */
    public deployManager(sender: Account): Promise<Address> {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise<Address>(async (resolve, reject) => {
            const abi = JSON.parse(
                fs.readFileSync(path.join(__dirname, "contracts", "TFCManager.abi.json")).toString(),
            );
            const data: Buffer = fs.readFileSync(path.join(__dirname, "contracts", "TFCManager.bin"));
            const contract = new this.web3.eth.Contract(abi);
            const tx = contract.deploy({
                data: data.toString().trim(),
            });
            this.sendTransaction(
                tx as
                    | ContractSendMethod
                    | PayableTransactionObject<any>
                    | NonPayableTransactionObject<any>
                    | Web3Core.TransactionConfig,
                undefined,
                {
                    from: sender.web3Account,
                    gas: 6000000,
                },
            )
                .then(async (receipt) => {
                    resolve(receipt.contractAddress as Address);
                })
                .catch(reject);
        });
    }

    /**
     * Get the {@link TFC} instance.
     *
     * @param tfcAddress the address of the smart contract of {@link TFC}
     * used to send transactions in the TFC instance.
     */
    public getTFC(tfcAddress: Address): TFC {
        return new TFC(this.web3, tfcAddress);
    }

    /**
     *  Get the {@link Manager} instance.
     *
     * @param managerAddress the address of the smart contract of {@link Manager}
     * used to send transactions in the TFC instance.
     */
    public getManager(managerAddress: Address): Manager {
        return new Manager(this.web3, managerAddress);
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
        const { privateKey } = this.web3.eth.accounts.create();
        return new Account(this.web3, privateKey);
    }

    /**
     * Get the ether balance of one account.
     * The unit of returned value will be wei (10^-18 ether).
     *
     * @param address Ethereum account address
     */
    public balanceOf(address: Address): Promise<BN> {
        return new Promise<BN>((resolve, reject) => {
            this.web3.eth
                .getBalance(address)
                .then((bal) => {
                    resolve(new BN(bal));
                })
                .catch(reject);
        });
    }

    /**
     * Transfer ether from sender to another address.
     * The ether is in the unit of wei.
     *
     * @param to recipient address
     * @param amount the amount of ether to transfer. (in the unit of wei)
     * @param sender sender account.
     */
    public transfer(to: Address, amount: BN, sender: Account): Promise<void> {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise<void>(async (resolve, reject) => {
            const tx = {
                to: to,
                value: amount,
                from: sender.address,
                // nonce: await this.web3.eth.getTransactionCount(sender.address, "pending"),
            };
            this.sendTransaction(tx, to, { from: sender.web3Account })
                .then(() => {
                    resolve();
                })
                .catch(reject);
        });
    }

    /**
     * Convert wei unit to ether unit
     *
     * @param amount
     */
    public wei2ether(amount: BN): BN {
        return new BN(this.web3.utils.fromWei(amount, "ether"));
    }

    /**
     * Convert ether unit to wei unit
     *
     * @param amount
     */
    public ether2wei(amount: BN): BN {
        return new BN(this.web3.utils.toWei(amount, "ether"));
    }
}
