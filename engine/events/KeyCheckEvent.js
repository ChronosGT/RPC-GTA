import { EventBase } from "./EventBase.js";
import { EventManager } from "./EventManager.js";
import { Encryptor } from "../Encryptor/Encryptor.js";
import { KeyCompleteRPC } from "../EventRPC/KeyCompleteRPC.js";


export class KeyCheckEvent extends EventBase {
    name = "key_check";

    actions (data) {
        const encryptID = new Encryptor(data.query[1]);
        const keyCompleteRPC = new KeyCompleteRPC(appOptions.key);

        appOptions.user_keys[encryptID.getEncryptID()] = appKeyInfo.computeSecret(data.query[0], "base64");
        data.connection.write(JSON.stringify(keyCompleteRPC.getMessage()));
    }
}

EventManager.register(new KeyCheckEvent());