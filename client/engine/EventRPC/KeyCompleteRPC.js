import { EventRPC } from "./EventRPC.js";

export class KeyCompleteRPC extends EventRPC {
    constructor(publicKey) {
        super();
        this.publicKey = publicKey;
    }

    getMessage() {
        return {
            type: "key_complete",
            query: [this.publicKey],
        }
    }
}