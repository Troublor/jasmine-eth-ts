"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Web3Wrapper_1 = __importDefault(require("./Web3Wrapper"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const bn_js_1 = __importDefault(require("bn.js"));
/**
 * TFC manager represent the TFCManager smart contract, which serves as a proxy for TFC users to claim (withdraw) TFC tokens.
 */
class Manager extends Web3Wrapper_1.default {
    /**
     * Construct an TFCManager object representing the TFCManager smart contract,
     * using web3 instance, address of contract
     *
     * Usually this constructor should not be called.
     * Manager objects should be instantiated by {@link SDK}.
     *
     * @param web3
     * @param managerAddress
     */
    constructor(web3, managerAddress) {
        super(web3);
        this.address = managerAddress;
        this.abi = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, "contracts", "TFCManager.abi.json")).toString());
        this.contract = new web3.eth.Contract(this.abi, managerAddress);
    }
    /**
     * Get the address of the TFCToken ERC20 contract, which are created/managed by the manager.
     */
    async tfcAddress() {
        return this.contract.methods.tfcToken().call();
    }
    /**
     * Get the address of the signer who have the privilege to authorize users to claim TFC tokens
     */
    async signer() {
        return this.contract.methods.signer().call();
    }
    /**
     * Check if the nonce (for TFCClaim) has been used
     * @param nonce
     */
    async nonceUsed(nonce) {
        return this.contract.methods.usedNonces(nonce.toString()).call();
    }
    /**
     * Get one unused nonce, which will be used in signing TFCClaim message
     */
    async getUnusedNonce() {
        let nonce = new bn_js_1.default(0);
        // find an unused nonce
        while (await this.nonceUsed(nonce)) {
            nonce = nonce.add(new bn_js_1.default(1));
        }
        return nonce;
    }
    /**
     * Claim TFC tokens with the authorization from signer.
     * This is the function called by users who want to claim/withdraw TFC tokens.
     *
     * @param amount the amount of TFC token to claim
     * @param nonce the nonce used in the signature
     * @param sig the signature signed by the signer who has privilege to authorize TFC claim
     * @param claimer the account to receive the claimed TFC tokens. It must be the same with the recipient of signature
     */
    async claimTFC(amount, nonce, sig, claimer) {
        const tx = this.contract.methods.claimTFC(amount.toString(), nonce.toString(), sig);
        return new Promise((resolve, reject) => {
            this.sendTransaction(tx, this.address, {
                from: claimer.web3Account,
            })
                .then(() => resolve())
                .catch(reject);
        });
    }
    /**
     * Sign a message to claim TFC tokens.
     *
     * @param recipient the account to receive TFC tokens
     * @param amount the amount of TFC tokens to claim
     * @param nonce the nonce used. Each nonce can only be used once
     * @param signer the account who has the privilege to authorize TFC claim
     */
    signTFCClaim(recipient, amount, nonce, signer) {
        const hash = this.web3.utils.soliditySha3(recipient, amount, nonce, this.address);
        return this.web3.eth.accounts.sign(hash, signer.privateKey).signature;
    }
    /**
     * Check whether TFC Manager has been deployed on current network
     */
    async deployed() {
        try {
            await this.tfcAddress();
            return true;
        }
        catch (e) {
            return false;
        }
    }
}
exports.default = Manager;
//# sourceMappingURL=Manager.js.map