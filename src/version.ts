import * as fs from "fs";
import * as path from "path";

const info = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "package.json"), { encoding: "utf-8" }));
const major = parseInt(info.version.split(".")[0]);
const minor = parseInt(info.version.split(".")[1]);
const patch = parseInt(info.version.split(".")[2]);

export interface Version {
    versionStr: string;
    versionNum: number;
}

export function versionStr(): string {
    return `v${major}.${minor},${patch}`;
}

export function versionNum(): number {
    return major * 1000000 + minor * 1000 + patch;
}
