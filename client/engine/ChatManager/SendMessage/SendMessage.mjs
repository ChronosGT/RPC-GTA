import net from "net";

import { ChatManager } from "../ChatManager.mjs";
import { EncryptID } from "../../Encryptor/EncryptID/EncryptID.mjs";
import { KeyCheckRPC } from "../../EventRPC/KeyRPC/KeyCheckRPC.mjs";
import { MessageRPC } from "../../EventRPC/MessageRPC/MessageRPC.mjs";
import { EncryptKey } from "../../Encryptor/EncryptKey/EncryptKey.mjs";


export class SendMessage extends ChatManager {
    constructor(message, client) {
        super();
        this.message = message;
        this.client = client;
    }

    action() {
        const encryptID = new EncryptID(this.client);
        let encrypt_address = encryptID.getData();

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
                    const encryptKey = new EncryptKey(key, this.message);
                    const messageRPC = new MessageRPC(appOptions.client, encryptKey.getData(), new Date().getTime());
                    appOptions.connections[encrypt_address].write(JSON.stringify(messageRPC.getMessage()));
                }
            })
        } else {
            const key = appOptions.user_keys[encrypt_address];
            const encryptKey = new EncryptKey(key, this.message);
            const messageRPC = new MessageRPC(appOptions.client, encryptKey.getData(), new Date().getTime());
            appOptions.connections[encrypt_address].write(JSON.stringify(messageRPC.getMessage()));
        }
    }
}