import net from "net";

import config from "./engine/config.js";
import log from "./engine/module/log/index.js"
import { ChatManager } from "./engine/ChatManager/ChatManager.js";

const chatManager = new ChatManager();

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

    chatManager.fire(data);
  });

  connection.on('error', () => {
    chatManager.fire({ type: "auth" });
  });

  connection.on('close', () => {
    chatManager.fire({ type: "auth" });
  });

});

server.listen(config.server.port, () => {
  appOptions.server.address = server.address().address;
  appOptions.server.port = server.address().port;

  log.info(`Приложение успешно запущено, используется: IP: ${appOptions.server.address} | Порт: ${appOptions.server.port}`);
});
