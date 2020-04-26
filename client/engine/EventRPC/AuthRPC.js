import { EventRPC } from "./EventRPC.js";

export class AuthRPC extends EventRPC {
    constructor(address, port) {
        super();
        this.address = address;
        this.port = port;
    }

    getMessage() {
        return {
            type: "auth",
            query: [this.address, this.port]
        }
    }
}