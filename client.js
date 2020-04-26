import net from "net";
import crypto from "crypto"

import config from "./engine/config.js";
import log from "./engine/module/log/index.js"
import readline from "./engine/module/readline/index.js"

import { AuthRPC } from "./engine/EventRPC/AuthRPC.js";
import { EventManager } from "./engine/events/EventManager.js";
import { UserPoolEvent } from "./engine/events/UserPoolEvent.js";
import { MessageEvent } from "./engine/events/MessageEvent.js";
import { KeyCheckEvent } from "./engine/events/KeyCheckEvent.js";
import { SendMessageEvent } from "./engine/events/SendMessageEvent.js";

const eventManager = new EventManager();


global.appKeyInfo = crypto.createECDH("secp256k1");
appKeyInfo.generateKeys();

global.appOptions = {
    client: {
        address: '',
        port: ''
    },
    key: appKeyInfo.getPublicKey().toString('base64'),
    user_pool: [],
    user_keys: {},
    connections: {}
};


const server = net.createServer(connection => {
    connection.setEncoding('utf8');

    connection.on('data', (data) => {
        data = data.toString();
        data = (typeof data === "object") ? data : JSON.parse(data);
        data.connection = connection;
        eventManager.fire(data);
    });
});

server.listen(0,() => {
    appOptions.client.address = server.address().address;
    appOptions.client.port = server.address().port;
    const authRPC = new AuthRPC(appOptions.client.address, appOptions.client.port);

    readline.setPrompt(`[client] ${appOptions.client.port} : `);
    log.info(`Приложение успешно запущено, используется: IP: ${appOptions.client.address} | Порт: ${appOptions.client.port}`);

    const client = net.connect(config.server.port, config.server.address, function () {
        log.info("Подключение к серверу успешно!");
        readline.prompt();
    });
    client.on("error", () => {
        log.info("Подключение к серверу завершилось ошибкой!");
        readline.prompt();
    });
    client.write(JSON.stringify(authRPC.getMessage()));
});