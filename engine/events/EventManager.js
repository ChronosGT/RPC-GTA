/**
 *
 * @type {Map<string, EventBase>}
 */
const events = new Map();

export class EventManager {
    static register(event) {
        events.set(event.name, event);
    }

    fire(data) {
        if (events.has(data.type))
            events.get(data.type).actions(data);
    }
}