import readline from "readline";
import log from "../log/index.js";
import { EventManager } from "../../events/EventManager.js";

const eventManager = new EventManager();

const readline_interface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

readline_interface.on("line", (res) => {
    if (res === "") return readline_interface.prompt();
    res = res.split(' ');
    let client = res[0];
    res = res.filter(x => x !== client);
    res = res.join(' ');

    if (client === "-1") {
        for (let item of appOptions.user_pool) {
            eventManager.fire({type: "send_message", message: res, client: item});
        }
        readline_interface.prompt();
        return;
    }

    let index = appOptions.user_pool.findIndex(x => x.port.toString() === client);
    if (index === -1) {
        log.info("Не верный ID клиента!");
        readline_interface.prompt();
        return;
    }

    eventManager.fire({type: "send_message", message: res, client: appOptions.user_pool[index]});

    readline_interface.prompt();
});

export { readline_interface as default }