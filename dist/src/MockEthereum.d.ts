import ganacheCore from "ganache-core";
/**
 * A Mock Ethereum network, based on ganache-core, which provides predefined accounts (with 100 ethers each) and an endpoint for SDK.
 */
export default class MockEthereum {
    /**
     * Predefined account privateKeys
     */
    readonly predefinedPrivateKeys: string[];
    /**
     * The endpoint of mock Ethereum for use in SKD
     */
    readonly endpoint: ganacheCore.Provider;
    /**
     * Construct a mock Ethereum environment, where each of the predefined privateKeys are initially faucet 100 Ethers
     */
    constructor();
}
//# sourceMappingURL=MockEthereum.d.ts.map