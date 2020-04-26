import { EventRPC } from "./EventRPC.js";

export class KeyCheckRPC extends EventRPC {
    constructor(publicKey, client) {
        super();
        this.publicKey = publicKey;
        this.client = client;
    }

    getMessage() {
        return {
            type: "key_check",
            query: [this.publicKey, this.client],
        }
    }

}