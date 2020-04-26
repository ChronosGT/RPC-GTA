import crypto from "crypto";
import config from "../config.mjs";

export class Encryptor {
    constructor(text, publicKey = config.encryption) {
        this.text = text;
        this.publicKey = publicKey;
    }

    getEncryptID() {
        let encryptText = this.text.address + '::' + this.text.port;
        return crypto.createHmac('sha256', this.publicKey).update(encryptText).digest('hex');
    }
}