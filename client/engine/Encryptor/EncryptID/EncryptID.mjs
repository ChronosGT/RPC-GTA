import crypto from "crypto";

import config from "../../config.mjs";

import { Encryptor } from "../Encryptor.mjs";

export class EncryptID extends Encryptor {
    constructor(client) {
        super();
        this.encryption = config.encryption;
        this.client = client;
    }

    getData() {
        let encryptText = this.client.address + '::' + this.client.port;
        return crypto.createHmac('sha256', this.encryption).update(encryptText).digest('hex');
    }
}