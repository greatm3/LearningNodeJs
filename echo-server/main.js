import Server from "./Server.js";
import Logger from "./Logger.js";

const server = new Server(59000, "localhost", "Test Room")

const loggerParameters = {
  logFile: "log.txt",
  logPath: "logs/",
  eventEmitter: server
}

Logger.start(loggerParameters);

server.start()
