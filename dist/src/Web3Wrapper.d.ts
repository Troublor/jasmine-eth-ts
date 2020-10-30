import Web3 from "web3";
import Web3Core from "web3-core";
import { Address } from "./types";
import { TransactionObject } from "./contracts/types";
import { ContractSendMethod } from "web3-eth-contract";
import BN from "bn.js";
export interface TransactionConfig {
    from: string;
    to: string;
    value?: number | string | BN;
    gas?: number | string;
    gasPrice?: number | string | BN;
    data?: string;
    nonce?: number;
    chainId?: number;
}
export default abstract class Web3Wrapper {
    protected _web3: Web3;
    protected _defaultWeb3Account: Web3Core.Account;
    protected _confirmationRequirement: number;
    protected constructor(web3: Web3, privateKeyOrWeb3Account?: string | Web3Core.Account);
    protected setDefaultAccount(privateKey: string): void;
    get defaultAccountAddress(): Address;
    get defaultWeb3Account(): Web3Core.Account;
    get web3(): Web3;
    get confirmationRequirement(): number;
    set confirmationRequirement(value: number);
    protected signContractTransaction(transaction: TransactionObject<any> | ContractSendMethod, to: Address, options?: {
        from?: Web3Core.Account;
        value?: number | string | BN;
        gas?: number;
    }): Promise<Web3Core.SignedTransaction>;
    protected signSimpleTransaction(transaction: TransactionConfig, to: Address, options?: {
        from?: Web3Core.Account;
        value?: number | string | BN;
        gas?: number;
    }): Promise<Web3Core.SignedTransaction>;
    protected sendTransaction(transaction: TransactionObject<any> | ContractSendMethod | TransactionConfig, to: Address, options?: {
        from?: Web3Core.Account;
        value?: number | string | BN;
        gas?: number;
    }): Promise<Web3Core.TransactionReceipt>;
}
//# sourceMappingURL=Web3Wrapper.d.ts.map