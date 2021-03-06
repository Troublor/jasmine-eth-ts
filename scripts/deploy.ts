import SDK from "../index";

async function deploy(endpoint: string) {
    const sdk = new SDK(endpoint);
    const admin = sdk.retrieveAccount("0x11cb04ef3d5b276da031e0410d9425726187739cbe54cdedd5401911e7428df3");
    const managerAddr = await sdk.deployManager(admin);
    console.log(managerAddr as string);
}

const rinkeby = "wss://rinkeby.infura.io/ws/v3/e8e5b9ad18ad4daeb0e01a522a989d66";
deploy(rinkeby);
