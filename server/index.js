import net from "net";

import config from "./engine/config.js";
import log from "./engine/module/log/index.js"
import { EventManager } from "./engine/EventManager/EventManager.js";

const eventManager = new EventManager();

global.appOptions = {
  server: {
    address: '',
    port: ''
  },
  user_pool: [],
  connections: {}
};

const server = net.createServer(connection => {
  connection.setEncoding('utf8');

  connection.on('data', (data) => {
    data = data.toString();
    data = (typeof data === "object") ? data : JSON.parse(data);

    eventManager.fire(data);
  });

  connection.on('error', () => {
    eventManager.fire({ type: "auth" });
  });

  connection.on('close', () => {
    eventManager.fire({ type: "auth" });
  });

});

server.listen(config.server.port, () => {
  appOptions.server.address = server.address().address;
  appOptions.server.port = server.address().port;

  log.info(`Приложение успешно запущено, используется: IP: ${appOptions.server.address} | Порт: ${appOptions.server.port}`);
});
