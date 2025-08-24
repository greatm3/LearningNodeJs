import Server from "./Server.js";
import Logger from "./Logger.js";

const config = {
    logger: console.log
}
const server = new Server(59000, "localhost", config)

server.start()