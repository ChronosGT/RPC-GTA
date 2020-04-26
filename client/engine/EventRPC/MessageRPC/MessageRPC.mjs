import { EventRPC } from "../EventRPC.mjs";

export class MessageRPC extends EventRPC {
    constructor(client, message, time) {
        super();
        this.client = client;
        this.message = message;
        this.time = time;
    }

    getMessage() {
        return {
            id: this.genKey(),
            type: "message",
            query: [this.client, this.message, this.time],
        }
    }
}