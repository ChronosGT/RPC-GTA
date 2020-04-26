import { EventRPC } from "../EventRPC.mjs";

export class UserPoolRPC extends EventRPC {
    constructor(clients) {
        super();
        this.clients = clients;
    }

    getMessage() {
        return {
            id: this.genKey(),
            type: "user_pool",
            query: [this.clients]
        }
    }
}