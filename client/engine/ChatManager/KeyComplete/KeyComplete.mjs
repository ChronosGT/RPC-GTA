import { ChatAbstract } from "../ChatAbstract.mjs";
import { Encryptor } from "../../Encryptor/Encryptor.mjs";
import { KeyCompleteRPC } from "../../EventRPC/KeyRPC/KeyCompleteRPC.mjs";

export class KeyComplete extends ChatAbstract {
    name = "key_complete";

    constructor(data) {
        super();
        this.client = data[1];
        this.connection = data[2];
        this.key = data[3];
    }

    actions() {
        const encryptID = new Encryptor(this.client);
        const keyCompleteRPC = new KeyCompleteRPC(appOptions.key);

        appOptions.user_keys[encryptID.getEncryptID()] = appKeyInfo.computeSecret(this.key, "base64");
        this.connection.write(JSON.stringify(keyCompleteRPC.getMessage()));
    }
}