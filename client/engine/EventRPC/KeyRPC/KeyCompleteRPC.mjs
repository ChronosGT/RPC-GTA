import { EventRPC } from "../EventRPC.mjs";

export class KeyCompleteRPC extends EventRPC {
    constructor(publicKey) {
        super();
        this.publicKey = publicKey;
    }

    getMessage() {
        return {
            id: this.genKey(),
            type: "key_complete",
            query: [this.publicKey],
        }
    }
}