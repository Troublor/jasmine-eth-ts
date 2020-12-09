import Web3 from "web3";
import Web3Core from "web3-core";
import { Address } from "./types";
import { TransactionObject } from "./contracts/types";
import { ContractSendMethod } from "web3-eth-contract";
import BN from "bn.js";
export default abstract class Web3Wrapper {
    protected _web3: Web3;
    protected _confirmationRequirement: number;
    protected constructor(web3: Web3);
    get web3(): Web3;
    get confirmationRequirement(): number;
    set confirmationRequirement(value: number);
    protected signContractTransaction(
        transaction: TransactionObject<any> | ContractSendMethod,
        to: Address | undefined,
        options: {
            from: Web3Core.Account;
            value?: number | string | BN;
            gas?: number;
        },
    ): Promise<Web3Core.SignedTransaction>;
    protected signSimpleTransaction(
        transaction: Web3Core.TransactionConfig,
        to: Address | undefined,
        options: {
            from: Web3Core.Account;
            value?: number | string | BN;
            gas?: number;
        },
    ): Promise<Web3Core.SignedTransaction>;
    protected sendTransaction(
        transaction: ContractSendMethod | TransactionObject<any> | Web3Core.TransactionConfig,
        to: Address | undefined,
        options: {
            from: Web3Core.Account;
            value?: number | string | BN;
            gas?: number;
        },
    ): Promise<Web3Core.TransactionReceipt>;
}
//# sourceMappingURL=Web3Wrapper.d.ts.map
