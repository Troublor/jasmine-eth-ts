"use strict";
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../index"));
async function deploy(endpoint) {
    let sdk = new index_1.default(endpoint);
    let admin = sdk.retrieveAccount("0x11cb04ef3d5b276da031e0410d9425726187739cbe54cdedd5401911e7428df3");
    let managerAddr = await sdk.deployManager(admin);
    console.log(managerAddr);
}
const rinkeby = "wss://rinkeby.infura.io/ws/v3/e8e5b9ad18ad4daeb0e01a522a989d66";
deploy(rinkeby);
//# sourceMappingURL=deploy.js.map
