import SDK from "../src/SDK";
import BN from "bn.js";

(async () => {
    let sdk = new SDK("http://localhost:8545");
    let account = sdk.retrieveAccount("ebed9fb6edc4e965eae048a9ddefcd268f800925ba7371b8079558292e4f708b");
    let resp = await sdk.transfer(account.address, new BN(0), account);
    console.log(resp);
})()
