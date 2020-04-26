import { EventRPC } from "./EventRPC.js";

export class UserPoolRPC extends EventRPC {
    constructor(clients) {
        super();
        this.clients = clients;
    }

    getMessage() {
        return {
            type: "user_pool",
            query: [this.clients]
        }
    }
}