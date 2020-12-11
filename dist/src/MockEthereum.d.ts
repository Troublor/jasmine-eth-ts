import ganacheCore from "ganache-core";
import Web3Core from "web3-core";
/**
 * A Mock Ethereum network, based on ganache-core, which provides predefined accounts (with 100 ethers each) and an endpoint for SDK.
 */
export default class MockEthereum {
    /**
     * Predefined account privateKeys
     */
    readonly predefinedPrivateKeys: string[];
    private readonly server;
    /**
     * The endpoint of mock Ethereum for use in SKD
     */
    readonly endpoint: Web3Core.provider;
    /**
     * Construct a mock Ethereum environment, where each of the predefined privateKeys are initially faucet 100 Ethers
     */
    constructor(options?: ganacheCore.IServerOptions);
    listenOn(host: string, port: number): Promise<void>;
    stopListen(): Promise<void>;
}
//# sourceMappingURL=MockEthereum.d.ts.map
