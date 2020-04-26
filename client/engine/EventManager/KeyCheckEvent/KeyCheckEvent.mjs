import { EventAbstract } from "../EventAbstract.mjs";
import { ChatManager } from "../../ChatManager/ChatManager.mjs";

export class KeyCheckEvent extends EventAbstract {
    name = "key_check";

    constructor(data) {
        super();
        this.data = data
    }

    actions () {
        const chatManager = new ChatManager(["key_complete", this.data.query[1], this.data.connection, this.data.query[0]]);
        chatManager.fire();
    }
}