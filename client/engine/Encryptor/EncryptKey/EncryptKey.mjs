import crypto from "crypto";

import { Encryptor } from "../Encryptor.mjs";

export class EncryptKey extends Encryptor {
    constructor(publicKey, text) {
        super();
        this.publicKey = publicKey;
        this.text = text;
    }

    getData() {
        let iv = crypto.randomBytes(16);
        let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(this.publicKey), iv);
        let encrypted = cipher.update(this.text);

        encrypted = Buffer.concat([encrypted, cipher.final()]);

        return iv.toString('hex') + ':' + encrypted.toString('hex');
    }
}