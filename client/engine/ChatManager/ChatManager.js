import { SendMessage } from "./SendMessage.js";
import { KeyComplete } from "./KeyComplete.js";

export class ChatManager {
    constructor() {
        this.events = [
            new KeyComplete(),
            new SendMessage()
        ];
    }

    fire(data) {
        this.data = data;
        for (let event of this.events) {
            if (event.name === this.data[0]) {
                event.actions(this.data);
            }
        }
    }
}