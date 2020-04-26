import { UserPoolEvent } from "./UserPoolEvent.js";
import { MessageEvent } from "./MessageEvent.js";
import { KeyCheckEvent } from "./KeyCheckEvent.js";

export class EventManager {
    constructor() {
        this.events = [
            new UserPoolEvent(),
            new MessageEvent(),
            new KeyCheckEvent()
        ];
    }

    fire(data) {
        this.data = data;
        for (let event of this.events) {
            if (event.name === this.data.type) {
                event.actions(this.data);
            }
        }
    }
}