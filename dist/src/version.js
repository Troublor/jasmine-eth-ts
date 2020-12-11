"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.versionNum = exports.versionStr = void 0;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const info = require("root-require")("./package.json");
const major = parseInt(info.version.split(".")[0]);
const minor = parseInt(info.version.split(".")[1]);
const patch = parseInt(info.version.split(".")[2]);
function versionStr() {
    return `v${major}.${minor}.${patch}`;
}
exports.versionStr = versionStr;
function versionNum() {
    return major * 1000000 + minor * 1000 + patch;
}
exports.versionNum = versionNum;
//# sourceMappingURL=version.js.map