import { EventRPC } from "./EventRPC.js";

export class MessageRPC extends EventRPC {
    constructor(client, message, time) {
        super();
        this.client = client;
        this.message = message;
        this.time = time;
    }

    getMessage() {
        return {
            type: "message",
            query: [this.client, this.message, this.time],
        }
    }
}