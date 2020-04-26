import crypto from "crypto";

import { Encryptor } from "../Encryptor.mjs";

export class DecryptKey extends Encryptor {
    constructor(publicKey, text) {
        super();
        this.publicKey = publicKey;
        this.text = text;
    }

    getData() {
        let textParts = this.text.split(':');
        let iv = Buffer.from(textParts.shift(), 'hex');
        let encryptedText = Buffer.from(textParts.join(':'), 'hex');
        let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(this.publicKey), iv);
        let decrypted = decipher.update(encryptedText);

        decrypted = Buffer.concat([decrypted, decipher.final()]);

        return decrypted.toString();
    }
}