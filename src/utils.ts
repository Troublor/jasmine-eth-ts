import { Address } from "./types";
import Web3 from "web3";

/**
 * Validate if a string is a valid Ethereum address.
 * If it is valid, return an {@link Address}.
 * If invalid, return null;
 *
 * @param payload the string to validate and convert
 */
export function validateAndConvertAddress(payload: string): Address | null {
    if (Web3.utils.isAddress(payload)) {
        if (!payload.startsWith("0x")) {
            payload = '0x' + payload;
        }
        return payload as Address;
    } else {
        return null;
    }
}
