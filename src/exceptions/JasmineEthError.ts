export default class JasmineEthError extends Error {
    constructor(errorMsg: string) {
        super(errorMsg);
        Object.setPrototypeOf(this, JasmineEthError.prototype);
    }
}
