import {Address} from "./types";
import {TfcToken} from "./contracts/TFCToken";
import Web3 from "web3";
import Web3Utils from "web3-utils";
import Web3Wrapper from "./Web3Wrapper";
import fs from "fs";
import path from "path";
import BN from "bn.js";
import Account from "./Account";

/**
 * TFC Token contract representation.
 *
 */
export default class TFC extends Web3Wrapper {
    public readonly address: Address;
    public readonly _contract: TfcToken;
    public readonly _abi: Web3Utils.AbiItem[];

    /**
     * Construct an TFC object using web3 instance, address of contract
     * Usually this constructor should not be called.
     * TFC objects should be instantiated by {@link SDK}.
     *
     * @param web3
     * @param tfcAddress
     */
    constructor(web3: Web3, tfcAddress: Address) {
        super(web3);
        this.address = tfcAddress;
        this._abi = JSON.parse(fs.readFileSync(path.join(__dirname, "contracts", "TFCToken.abi.json")).toString());
        this._contract = (new web3.eth.Contract(this._abi, tfcAddress) as unknown) as TfcToken;
    }

    /**
     * Get the web3.js contract object.
     */
    get contract(): TfcToken {
        return this._contract;
    }

    get abi(): Web3Utils.AbiItem[] {
        return this._abi;
    }

    /**
     * Get the name of TFC Token.
     */
    public async name(): Promise<string> {
        return this._contract.methods.name().call();
    }

    /**
     * Get the symbol of TFC Token
     */
    public async symbol(): Promise<string> {
        return this._contract.methods.symbol().call();
    }

    /**
     * Get the number of decimals TFC token uses.
     */
    public async decimals(): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            this._contract.methods
                .decimals()
                .call()
                .then((r: string) => {
                    resolve(parseInt(r));
                })
                .catch(reject);
        });
    }

    /**
     * Get the total supply of TFC Token.
     */
    public async totalSupply(): Promise<BN> {
        return new Promise<BN>((resolve, reject) => {
            this._contract.methods
                .totalSupply()
                .call()
                .then((r: string) => {
                    resolve(new BN(r));
                })
                .catch(reject);
        });
    }

    /**
     * Get the amount of token which spender is still allowed to withdraw from owner.
     * This method is useful when a user delegate an agent to spend his tokens.
     *
     * @param owner Ethereum address of owner
     * @param spender Ethereum address of spender
     */
    public async allowance(owner: Address, spender: Address): Promise<BN> {
        return new Promise<BN>((resolve, reject) => {
            this._contract.methods
                .allowance(owner, spender)
                .call()
                .then((r: string) => {
                    resolve(new BN(r));
                })
                .catch(reject);
        });
    }

    /**
     * Get the TFC Token balance of the account.
     *
     * @param owner Ethereum address of the account
     */
    public async balanceOf(owner: Address): Promise<BN> {
        return new Promise<BN>((resolve, reject) => {
            this._contract.methods
                .balanceOf(owner)
                .call()
                .then((r: string) => {
                    resolve(new BN(r));
                })
                .catch(reject);
        });
    }

    /**
     * Get a list of Ethereum addresses of administrators of TFC Token.
     * Administrators are qualified to mint new tokens.
     */
    public async adminAddresses(): Promise<Address[]> {
        const adminRole = await this._contract.methods.DEFAULT_ADMIN_ROLE().call();
        const adminCount = parseInt(await this._contract.methods.getRoleMemberCount(adminRole).call());
        const admins: Address[] = [];
        for (let i = 0; i < adminCount; i++) {
            admins.push(await this._contract.methods.getRoleMember(adminRole, i).call());
        }
        return admins;
    }

    /**
     * Check if one account is allowed to mint new tokens.
     *
     * @param sender the account to check.
     * @param sender the account to check.
     */
    public async canMint(sender: Account): Promise<boolean> {
        const address = sender.address;
        const minterRole = await this._contract.methods.MINTER_ROLE().call();
        return await this._contract.methods.hasRole(minterRole, address).call();
    }

    /**
     * Transfer money from sender to another account
     *
     * @param to Ethereum address of the recipient account
     * @param amount the amount of tokens to transfer
     * @param sender the sender account of this transaction.
     */
    public async transfer(to: Address, amount: BN, sender: Account): Promise<void> {
        const tx = this._contract.methods.transfer(to, amount.toString());
        return new Promise<void>((resolve, reject) => {
            this.sendTransaction(tx, this.address, {
                from: sender.web3Account,
            })
                .then(() => resolve())
                .catch(reject);
        });
    }

    /**
     * Transfer money from account {@param from} to account {@param to}.
     * This is useful when an agent transfers tokens as a delegate of a user.
     * The transaction sender must have enough allowance from account {@param from} to spend tokens.
     *
     * @param from Ethereum address of the account whose tokens are transferred out
     * @param to Ethereum address of the account who receives the tokens
     * @param amount the amount to transfer
     * @param sender transaction sender.
     * This sender is different from the {@param from}.
     */
    public async transferFrom(from: Address, to: Address, amount: BN, sender: Account): Promise<void> {
        const tx = this._contract.methods.transferFrom(from, to, amount.toString());
        return new Promise<void>((resolve, reject) => {
            this.sendTransaction(tx, this.address, {
                from: sender.web3Account,
            })
                .then(() => resolve())
                .catch(reject);
        });
    }

    /**
     * Approve one spender a certain amount of token to spend.
     *
     * @param spender Ethereum address of the spender
     * @param amount the amount of tokens to approve
     * @param sender transaction sender, the owner of the token.
     */
    public async approve(spender: Address, amount: BN, sender: Account): Promise<void> {
        const tx = this._contract.methods.approve(spender, amount.toString());
        return new Promise<void>((resolve, reject) => {
            this.sendTransaction(tx, this.address, {
                from: sender.web3Account,
            })
                .then(() => resolve())
                .catch(reject);
        });
    }

    /**
     * Mint a certain amount of tokens from nowhere and put the tokens in one account.
     * The transaction sender must be the one of administrators listed by {@link TFC.adminAddresses}.
     *
     * @param to Ethereum address of the account to received the minted tokens
     * @param amount the amount of tokens to mint
     * @param sender transaction sender.
     */
    public async mint(to: Address, amount: BN, sender: Account): Promise<void> {
        const tx = this._contract.methods.mint(to, amount.toString());
        return new Promise<void>((resolve, reject) => {
            this.sendTransaction(tx, this.address, {
                from: sender.web3Account,
            })
                .then(() => resolve())
                .catch(reject);
        });
    }

    /**
     * Perform a one-to-many token transfer, tokens are transferred from the sender's account to the recipients.
     *
     * @param bundledTransfer the bundled transfer recipient and amount
     * @param sender the sender who sends the transaction and whose tokens are transferred
     */
    public async one2manyTransfer(
        bundledTransfer: { recipient: Address; amount: BN }[],
        sender: Account,
    ): Promise<void> {
        const recipients = [];
        const amounts = [];
        for (const t of bundledTransfer) {
            recipients.push(t.recipient);
            amounts.push(t.amount);
        }
        const tx = this._contract.methods.one2manyTransfer(
            recipients,
            amounts.map((a) => a.toString()),
        );
        return new Promise<void>((resolve, reject) => {
            this.sendTransaction(tx, this.address, {
                from: sender.web3Account,
            })
                .then(() => resolve())
                .catch(reject);
        });
    }

    /**
     * Check whether TFC ERC20 has been deployed on current network
     */
    public async deployed(): Promise<boolean> {
        try {
            const symbol = await this.symbol();
            return symbol === "TFC";
        } catch (e) {
            return false;
        }
    }
}
