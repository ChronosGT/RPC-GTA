import net from "net";
import crypto from "crypto"

import config from "./engine/config.mjs";
import log from "./engine/module/log/index.mjs"
import readline from "./engine/module/readline/index.mjs"

import { AuthRPC } from "./engine/EventRPC/AuthRPC/AuthRPC.mjs";
import { EventManager } from "./engine/EventManager/EventManager.mjs";

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

        const eventManager = new EventManager(data);
        eventManager.fire();
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