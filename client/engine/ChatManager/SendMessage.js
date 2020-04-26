import net from "net";

import { ChatBase } from "./ChatBase.js";
import { Encryptor } from "../Encryptor/Encryptor.js";
import { KeyCheckRPC } from "../EventRPC/KeyCheckRPC.js";
import { MessageRPC } from "../EventRPC/MessageRPC.js";


export class SendMessage extends ChatBase {
    name = "send_message";

    actions(data) {
        this.message = data[1];
        this.client = data[2];

        const encryptID = new Encryptor(this.client);
        let encrypt_address = encryptID.getEncryptID();

        if (appOptions.connections[encrypt_address] === undefined) {
            appOptions.connections[encrypt_address] = net.connect(this.client.port, this.client.address).setEncoding('utf8');
        }

        if (appOptions.user_keys[encrypt_address] === undefined) {
            const keyCheckRPC = new KeyCheckRPC(appOptions.key, appOptions.client);

            appOptions.connections[encrypt_address].write(JSON.stringify(keyCheckRPC.getMessage()));
            appOptions.connections[encrypt_address].on('data', (data) => {
                data = data.toString();
                data = (typeof data === "object") ? data : JSON.parse(data);
                if (data.type === "key_complete") {
                    appOptions.user_keys[encrypt_address] = appKeyInfo.computeSecret(data.query[0], "base64");
                    const key = appOptions.user_keys[encrypt_address];
                    const encryptKey = new Encryptor(this.message, key);
                    const messageRPC = new MessageRPC(appOptions.client, encryptKey.getEncrypt(), new Date().getTime());
                    appOptions.connections[encrypt_address].write(JSON.stringify(messageRPC.getMessage()));
                }
            })
        } else {
            const key = appOptions.user_keys[encrypt_address];
            const encryptKey = new Encryptor(this.message, key);
            const messageRPC = new MessageRPC(appOptions.client, encryptKey.getEncrypt(), new Date().getTime());
            appOptions.connections[encrypt_address].write(JSON.stringify(messageRPC.getMessage()));
        }
    }
}