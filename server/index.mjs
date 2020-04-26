import net from "net";

import config from "./engine/config.mjs";
import log from "./engine/module/log/index.mjs"
import { Broadcast } from "./engine/ChatManager/Broadcast/Broadcast.mjs";

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

    if (data.type === "auth") {
      log.info(`Новое подключение: IP: ${data.query[0]} | Порт: ${data.query[1]}`);

      appOptions.user_pool.push({address: data.query[0], port: data.query[1]});
      const broadcast = new Broadcast();
      broadcast.action();
    }
  });

  connection.on('error', () => {
    const broadcast = new Broadcast();
    broadcast.action();
  });

  connection.on('close', () => {
    const broadcast = new Broadcast();
    broadcast.action();
  });

});

server.listen(config.server.port, () => {
  appOptions.server.address = server.address().address;
  appOptions.server.port = server.address().port;

  log.info(`Приложение успешно запущено, используется: IP: ${appOptions.server.address} | Порт: ${appOptions.server.port}`);
});
