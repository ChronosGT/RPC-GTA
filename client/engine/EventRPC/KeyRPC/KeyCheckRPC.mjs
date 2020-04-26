import { EventRPC } from "../EventRPC.mjs";

export class KeyCheckRPC extends EventRPC {
    constructor(publicKey, client) {
        super();
        this.publicKey = publicKey;
        this.client = client;
    }

    getMessage() {
        return {
            id: this.genKey(),
            type: "key_check",
            query: [this.publicKey, this.client],
        }
    }

}