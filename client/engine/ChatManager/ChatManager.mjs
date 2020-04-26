import { SendMessage } from "./SendMessage/SendMessage.mjs";
import { KeyComplete } from "./KeyComplete/KeyComplete.mjs";

export class ChatManager {
    constructor(data) {
        this.data = data;
        this.events = [
            new SendMessage(this.data),
            new KeyComplete(this.data)
        ];
    }

    fire() {
        for (let event of this.events) {
            if (event.name === this.data[0]) {
                event.actions();
            }
        }
    }
}