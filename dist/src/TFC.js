"use strict";
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, "__esModule", { value: true });
const Web3Wrapper_1 = __importDefault(require("./Web3Wrapper"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const bn_js_1 = __importDefault(require("bn.js"));
/**
 * TFC Token contract representation.
 *
 */
class TFC extends Web3Wrapper_1.default {
    /**
     * Construct an TFC object using web3 instance, address of contract
     * Usually this constructor should not be called.
     * TFC objects should be instantiated by {@link SDK}.
     *
     * @param web3
     * @param tfcAddress
     */
    constructor(web3, tfcAddress) {
        super(web3);
        this.address = tfcAddress;
        this._abi = JSON.parse(
            fs_1.default.readFileSync(path_1.default.join(__dirname, "contracts", "TFCToken.abi.json")).toString(),
        );
        this._contract = new web3.eth.Contract(this._abi, tfcAddress);
    }
    /**
     * Get the web3.js contract object.
     */
    get contract() {
        return this._contract;
    }
    get abi() {
        return this._abi;
    }
    /**
     * Get the name of TFC Token.
     */
    async name() {
        return this._contract.methods.name().call();
    }
    /**
     * Get the symbol of TFC Token
     */
    async symbol() {
        return this._contract.methods.symbol().call();
    }
    /**
     * Get the number of decimals TFC token uses.
     */
    async decimals() {
        return new Promise((resolve, reject) => {
            this._contract.methods
                .decimals()
                .call()
                .then((r) => {
                    resolve(parseInt(r));
                })
                .catch(reject);
        });
    }
    /**
     * Get the total supply of TFC Token.
     */
    async totalSupply() {
        return new Promise((resolve, reject) => {
            this._contract.methods
                .totalSupply()
                .call()
                .then((r) => {
                    resolve(new bn_js_1.default(r));
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
    async allowance(owner, spender) {
        return new Promise((resolve, reject) => {
            this._contract.methods
                .allowance(owner, spender)
                .call()
                .then((r) => {
                    resolve(new bn_js_1.default(r));
                })
                .catch(reject);
        });
    }
    /**
     * Get the TFC Token balance of the account.
     *
     * @param owner Ethereum address of the account
     */
    async balanceOf(owner) {
        return new Promise((resolve, reject) => {
            this._contract.methods
                .balanceOf(owner)
                .call()
                .then((r) => {
                    resolve(new bn_js_1.default(r));
                })
                .catch(reject);
        });
    }
    /**
     * Get a list of Ethereum addresses of administrators of TFC Token.
     * Administrators are qualified to mint new tokens.
     */
    async adminAddresses() {
        const adminRole = await this._contract.methods.DEFAULT_ADMIN_ROLE().call();
        const adminCount = parseInt(await this._contract.methods.getRoleMemberCount(adminRole).call());
        const admins = [];
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
    async canMint(sender) {
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
    async transfer(to, amount, sender) {
        const tx = this._contract.methods.transfer(to, amount.toString());
        return new Promise((resolve, reject) => {
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
    async transferFrom(from, to, amount, sender) {
        const tx = this._contract.methods.transferFrom(from, to, amount.toString());
        return new Promise((resolve, reject) => {
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
    async approve(spender, amount, sender) {
        const tx = this._contract.methods.approve(spender, amount.toString());
        return new Promise((resolve, reject) => {
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
    async mint(to, amount, sender) {
        const tx = this._contract.methods.mint(to, amount.toString());
        return new Promise((resolve, reject) => {
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
    async one2manyTransfer(bundledTransfer, sender) {
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
        return new Promise((resolve, reject) => {
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
    async deployed() {
        try {
            const symbol = await this.symbol();
            return symbol === "TFC";
        } catch (e) {
            return false;
        }
    }
}
exports.default = TFC;
//# sourceMappingURL=TFC.js.map
