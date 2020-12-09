/* Generated by ts-generator ver. 0.0.8 */
/* tslint:disable */

import BN from "bn.js";
import { Contract, ContractOptions } from "web3-eth-contract";
import { EventLog } from "web3-core";
import { EventEmitter } from "events";
import { ContractEvent, Callback, TransactionObject, BlockType } from "./types";

interface EventOptions {
    filter?: object;
    fromBlock?: BlockType;
    topics?: string[];
}

export class IERC20 extends Contract {
    constructor(jsonInterface: any[], address?: string, options?: ContractOptions);
    clone(): IERC20;
    methods: {
        allowance(owner: string, spender: string): TransactionObject<string>;

        approve(spender: string, amount: number | string): TransactionObject<boolean>;

        balanceOf(account: string): TransactionObject<string>;

        totalSupply(): TransactionObject<string>;

        transfer(recipient: string, amount: number | string): TransactionObject<boolean>;

        transferFrom(sender: string, recipient: string, amount: number | string): TransactionObject<boolean>;
    };
    events: {
        Approval: ContractEvent<{
            owner: string;
            spender: string;
            value: string;
            0: string;
            1: string;
            2: string;
        }>;
        Transfer: ContractEvent<{
            from: string;
            to: string;
            value: string;
            0: string;
            1: string;
            2: string;
        }>;
        allEvents: (options?: EventOptions, cb?: Callback<EventLog>) => EventEmitter;
    };
}
