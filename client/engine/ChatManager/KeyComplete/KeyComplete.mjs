import { ChatManager } from "../ChatManager.mjs";
import { EncryptID } from "../../Encryptor/EncryptID/EncryptID.mjs";
import { KeyCompleteRPC } from "../../EventRPC/KeyRPC/KeyCompleteRPC.mjs";

export class KeyComplete extends ChatManager {
    constructor(client, connection, key) {
        super();
        this.client = client;
        this.connection = connection;
        this.key = key;
    }

    action() {
        const encryptID = new EncryptID(this.client);
        const keyCompleteRPC = new KeyCompleteRPC(appOptions.key);

        appOptions.user_keys[encryptID.getData()] = appKeyInfo.computeSecret(this.key, "base64");
        this.connection.write(JSON.stringify(keyCompleteRPC.getMessage()));
    }
}