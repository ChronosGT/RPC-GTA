import { EventBase } from "./EventBase.js";

export class UserPoolEvent extends EventBase {
    name = "user_pool";

    actions (data) {
        this.data = data;
        appOptions.user_pool = this.data.query[0].filter(x => x.port !== appOptions.client.port);
    }
}