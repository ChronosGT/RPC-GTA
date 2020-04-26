import log from "../module/log/index.js";
import readline from "../module/readline/index.js";
import { EventBase } from "./EventBase.js";
import { Encryptor } from "../Encryptor/Encryptor.js";
import { EventManager } from "./EventManager.js";

export class MessageEvent extends EventBase {
    name = "message";

    actions (data) {
        const encryptID = new Encryptor(data.query[0]);
        let encrypt_address = encryptID.getEncryptID();

        const decryptKey = new Encryptor(data.query[1], appOptions.user_keys[encrypt_address]);

        log.info(`
        Текст сообщения => ${decryptKey.getDecrypt()}
        Идентификатор приложения отправителя => ${data.query[0].port}
        Идентификатор приложения получателя => ${appOptions.client.port}
        Время отправления => ${new Date(data.query[2]).yyyymmddhm()}`);
        readline.prompt();
    }
}

EventManager.register(new MessageEvent());