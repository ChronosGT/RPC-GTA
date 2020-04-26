import { EventBase } from "./EventBase.js";
import { EventManager } from "./EventManager.js";

export class UserPoolEvent extends EventBase {
    name = "user_pool";

    actions (data) {
        appOptions.user_pool = data.query[0].filter(x => x.port !== appOptions.client.port);
    }
}

EventManager.register(new UserPoolEvent());