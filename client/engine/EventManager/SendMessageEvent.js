import net from "net";

import { EventBase } from "./EventBase.js";
import { Encryptor } from "../Encryptor/Encryptor.js";
import { KeyCheckRPC } from "../EventRPC/KeyCheckRPC.js";
import { MessageRPC } from "../EventRPC/MessageRPC.js";
import { EventManager } from "./EventManager.js";

export class SendMessageEvent extends EventBase {
    name = "send_message";

    actions(data) {
        const encryptID = new Encryptor(data.client);
        let encrypt_address = encryptID.getEncryptID();

        if (appOptions.connections[encrypt_address] === undefined) {
            appOptions.connections[encrypt_address] = net.connect(data.client.port, data.client.address).setEncoding('utf8');
        }

        if (appOptions.user_keys[encrypt_address] === undefined) {
            const keyCheckRPC = new KeyCheckRPC(appOptions.key, appOptions.client);

            appOptions.connections[encrypt_address].write(JSON.stringify(keyCheckRPC.getMessage()));
            appOptions.connections[encrypt_address].on('data', (data_connection) => {
                data_connection = data_connection.toString();
                data_connection = (typeof data_connection === "object") ? data_connection : JSON.parse(data_connection);
                if (data_connection.type === "key_complete") {
                    appOptions.user_keys[encrypt_address] = appKeyInfo.computeSecret(data_connection.query[0], "base64");
                    const key = appOptions.user_keys[encrypt_address];
                    const encryptKey = new Encryptor(data.message, key);
                    const messageRPC = new MessageRPC(appOptions.client, encryptKey.getEncrypt(), new Date().getTime());
                    appOptions.connections[encrypt_address].write(JSON.stringify(messageRPC.getMessage()));
                }
            })
        } else {
            const key = appOptions.user_keys[encrypt_address];
            const encryptKey = new Encryptor(data.message, key);
            const messageRPC = new MessageRPC(appOptions.client, encryptKey.getEncrypt(), new Date().getTime());
            appOptions.connections[encrypt_address].write(JSON.stringify(messageRPC.getMessage()));
        }
    }
}

EventManager.register(new SendMessageEvent());