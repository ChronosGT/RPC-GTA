import { ChatBase } from "./ChatBase.js";
import { Encryptor } from "../Encryptor/Encryptor.js";
import { KeyCompleteRPC } from "../EventRPC/KeyCompleteRPC.js";

export class KeyComplete extends ChatBase {
    name = "key_complete";

    actions(data) {
        this.client = data[1];
        this.connection = data[2];
        this.key = data[3];

        const encryptID = new Encryptor(this.client);
        const keyCompleteRPC = new KeyCompleteRPC(appOptions.key);

        appOptions.user_keys[encryptID.getEncryptID()] = appKeyInfo.computeSecret(this.key, "base64");
        this.connection.write(JSON.stringify(keyCompleteRPC.getMessage()));
    }
}