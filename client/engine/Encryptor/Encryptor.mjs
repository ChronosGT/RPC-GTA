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

    getEncrypt() {
        let iv = crypto.randomBytes(16);
        let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(this.publicKey), iv);
        let encrypted = cipher.update(this.text);

        encrypted = Buffer.concat([encrypted, cipher.final()]);

        return iv.toString('hex') + ':' + encrypted.toString('hex');
    }

    getDecrypt() {
        let textParts = this.text.split(':');
        let iv = Buffer.from(textParts.shift(), 'hex');
        let encryptedText = Buffer.from(textParts.join(':'), 'hex');
        let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(this.publicKey), iv);
        let decrypted = decipher.update(encryptedText);

        decrypted = Buffer.concat([decrypted, decipher.final()]);

        return decrypted.toString();
    }
}