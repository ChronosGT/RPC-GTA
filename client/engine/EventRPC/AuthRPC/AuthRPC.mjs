import { EventRPC } from "../EventRPC.mjs";

export class AuthRPC extends EventRPC {
    constructor(address, port) {
        super();
        this.address = address;
        this.port = port;
    }

    getMessage() {
        return {
            id: this.genKey(),
            type: "auth",
            query: [this.address, this.port]
        }
    }
}