import { EventBase } from "./EventBase.js";
import { ChatManager } from "../ChatManager/ChatManager.js";

const chatManager = new ChatManager();

export class KeyCheckEvent extends EventBase {
    name = "key_check";

    actions (data) {
        this.data = data;
        chatManager.fire(["key_complete", this.data.query[1], this.data.connection, this.data.query[0]]);
    }
}