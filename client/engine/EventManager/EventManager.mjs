import { UserPoolEvent } from "./UserPoolEvent/UserPoolEvent.mjs";
import { MessageEvent } from "./MessageEvent/MessageEvent.mjs";
import { KeyCheckEvent } from "./KeyCheckEvent/KeyCheckEvent.mjs";

export class EventManager {
    constructor(data) {
        this.data = data;
        this.events = [
            new UserPoolEvent(this.data),
            new MessageEvent(this.data),
            new KeyCheckEvent(this.data)
        ];
    }

    fire() {
        for (let event of this.events) {
            if (event.name === this.data.type) {
                event.actions();
            }
        }
    }
}