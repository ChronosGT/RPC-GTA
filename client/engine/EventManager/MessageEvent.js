import log from "../module/log/index.js";
import readline from "../module/readline/index.js";
import { EventBase } from "./EventBase.js";
import { Encryptor } from "../Encryptor/Encryptor.js";

export class MessageEvent extends EventBase {
    name = "message";

    actions (data) {
        this.data = data;
        const encryptID = new Encryptor(this.data.query[0]);
        let encrypt_address = encryptID.getEncryptID();

        const decryptKey = new Encryptor(this.data.query[1], appOptions.user_keys[encrypt_address]);

        log.info(`
        Текст сообщения => ${decryptKey.getDecrypt()}
        Идентификатор приложения отправителя => ${this.data.query[0].port}
        Идентификатор приложения получателя => ${appOptions.client.port}
        Время отправления => ${new Date(this.data.query[2]).yyyymmddhm()}`);
        readline.prompt();
    }
}