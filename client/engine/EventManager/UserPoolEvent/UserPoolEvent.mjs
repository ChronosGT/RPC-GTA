import { EventAbstract } from "../EventAbstract.mjs";

export class UserPoolEvent extends EventAbstract {
    name = "user_pool";

    constructor(data) {
        super();
        this.data = data
    }

    actions () {
        appOptions.user_pool = this.data.query[0].filter(x => x.port !== appOptions.client.port);
    }
}