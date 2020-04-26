import { Broadcast } from "./Broadcast.js";

export class EventManager {
    constructor() {
        this.events = [
            new Broadcast()
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