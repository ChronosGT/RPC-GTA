import net from "net";
import crypto from "crypto"

import config from "./engine/config.mjs";
import log from "./engine/module/log/index.mjs"
import readline from "./engine/module/readline/index.mjs"

import { AuthRPC } from "./engine/EventRPC/AuthRPC/AuthRPC.mjs";
import { EncryptID } from "./engine/Encryptor/EncryptID/EncryptID.mjs";
import { DecryptKey } from "./engine/Encryptor/DecryptKey/DecryptKey.mjs";
import { KeyComplete } from "./engine/ChatManager/KeyComplete/KeyComplete.mjs";

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

        switch (data.type) {
            case "user_pool":
                appOptions.user_pool = data.query[0].filter(x => x.port !== appOptions.client.port);
                break;
            case "message":
                const encryptID = new EncryptID(data.query[0]);
                let encrypt_address = encryptID.getData();

                const decryptKey = new DecryptKey(appOptions.user_keys[encrypt_address], data.query[1]);

                log.info(`
        Текст сообщения => ${decryptKey.getData()}
        Идентификатор приложения отправителя => ${data.query[0].port}
        Идентификатор приложения получателя => ${appOptions.client.port}
        Время отправления => ${new Date(data.query[2]).yyyymmddhm()}`);
                readline.prompt();
                break;
            case "key_check":
                const keyComplete = new KeyComplete(data.query[1], connection, data.query[0]);
                keyComplete.action();
        }
    });
});

server.listen(0,() => {
    appOptions.client.address = server.address().address;
    appOptions.client.port = server.address().port;

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

    const authRPC = new AuthRPC(appOptions.client.address, appOptions.client.port);

    client.write(JSON.stringify(authRPC.getMessage()));
});