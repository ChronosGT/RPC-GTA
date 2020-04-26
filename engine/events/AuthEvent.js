import net from "net";

import log from "../module/log/index.js";

import { EventBase } from "./EventBase.js";
import { Encryptor } from "../Encryptor/Encryptor.js";
import { UserPoolRPC } from "../EventRPC/UserPoolRPC.js";
import { EventManager } from "./EventManager.js";

export class AuthEvent extends EventBase {
    name = "auth";

    actions(data) {
        if (data.query !== undefined) {
            log.info(`Новое подключение: IP: ${data.query[0]} | Порт: ${data.query[1]}`);
            appOptions.user_pool.push({address: data.query[0], port: data.query[1]});
        }

        for (let item of appOptions.user_pool) {
            const encryptID = new Encryptor(item);
            let encrypt_address = encryptID.getEncryptID();
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

EventManager.register(new AuthEvent());