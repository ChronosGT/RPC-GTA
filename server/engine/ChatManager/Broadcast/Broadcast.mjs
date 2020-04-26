import net from "net";

import log from "../../module/log/index.mjs";

import { ChatManager } from "../ChatManager.mjs";
import { EncryptID } from "../../Encryptor/EncryptID/EncryptID.mjs";
import { UserPoolRPC } from "../../EventRPC/UserPoolRPC/UserPoolRPC.mjs";

export class Broadcast extends ChatManager {
    constructor() {
        super();
    }

    action() {
        for (let item of appOptions.user_pool) {
            const encryptID = new EncryptID(item);
            let encrypt_address = encryptID.getData();
            if (appOptions.connections[encrypt_address] === undefined) {
                appOptions.connections[encrypt_address] = net.connect(item.port, item.address);
                appOptions.connections[encrypt_address].on("error", () => {
                    if (!appOptions.user_pool.filter(x => x.port === item.port).length) return;

                    appOptions.user_pool = appOptions.user_pool.filter(x => x.port !== item.port);
                    log.info(`Потеряно соединение: IP: ${item.address} | Порт: ${item.port}`);
                    const userPoolRPC = new UserPoolRPC(appOptions.user_pool);
                    appOptions.connections[encrypt_address].write(JSON.stringify(userPoolRPC.getMessage()));
                });
            }

            const userPoolRPC = new UserPoolRPC(appOptions.user_pool);
            appOptions.connections[encrypt_address].write(JSON.stringify(userPoolRPC.getMessage()));

        }
    }
}