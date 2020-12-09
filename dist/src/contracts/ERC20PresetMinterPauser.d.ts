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

export class ERC20PresetMinterPauser extends Contract {
    constructor(jsonInterface: any[], address?: string, options?: ContractOptions);
    clone(): ERC20PresetMinterPauser;
    methods: {
        DEFAULT_ADMIN_ROLE(): TransactionObject<string>;

        MINTER_ROLE(): TransactionObject<string>;

        PAUSER_ROLE(): TransactionObject<string>;

        allowance(owner: string, spender: string): TransactionObject<string>;

        approve(spender: string, amount: number | string): TransactionObject<boolean>;

        balanceOf(account: string): TransactionObject<string>;

        burn(amount: number | string): TransactionObject<void>;

        burnFrom(account: string, amount: number | string): TransactionObject<void>;

        decimals(): TransactionObject<string>;

        decreaseAllowance(spender: string, subtractedValue: number | string): TransactionObject<boolean>;

        getRoleAdmin(role: string | number[]): TransactionObject<string>;

        getRoleMember(role: string | number[], index: number | string): TransactionObject<string>;

        getRoleMemberCount(role: string | number[]): TransactionObject<string>;

        grantRole(role: string | number[], account: string): TransactionObject<void>;

        hasRole(role: string | number[], account: string): TransactionObject<boolean>;

        increaseAllowance(spender: string, addedValue: number | string): TransactionObject<boolean>;

        mint(to: string, amount: number | string): TransactionObject<void>;

        name(): TransactionObject<string>;

        pause(): TransactionObject<void>;

        paused(): TransactionObject<boolean>;

        renounceRole(role: string | number[], account: string): TransactionObject<void>;

        revokeRole(role: string | number[], account: string): TransactionObject<void>;

        symbol(): TransactionObject<string>;

        totalSupply(): TransactionObject<string>;

        transfer(recipient: string, amount: number | string): TransactionObject<boolean>;

        transferFrom(sender: string, recipient: string, amount: number | string): TransactionObject<boolean>;

        unpause(): TransactionObject<void>;
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
        Paused: ContractEvent<string>;
        RoleAdminChanged: ContractEvent<{
            role: string;
            previousAdminRole: string;
            newAdminRole: string;
            0: string;
            1: string;
            2: string;
        }>;
        RoleGranted: ContractEvent<{
            role: string;
            account: string;
            sender: string;
            0: string;
            1: string;
            2: string;
        }>;
        RoleRevoked: ContractEvent<{
            role: string;
            account: string;
            sender: string;
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
        Unpaused: ContractEvent<string>;
        allEvents: (options?: EventOptions, cb?: Callback<EventLog>) => EventEmitter;
    };
}
