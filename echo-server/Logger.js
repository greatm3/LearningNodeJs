import path from "path";
import Server from "./Server.js";

class Logger {
    constructor({logPath, logFile, eventEmitter}) {
        this.logPath = logPath;
        this.logFile = logFile;
        this.eventEmitter = eventEmitter;
    }

    static start({ logPath, logFile, eventEmitter }) {
        return new Logger({ logPath, logFile, eventEmitter });
    }

}

const testServer = new Server(5900, "localhost");

const logger = Logger.start({
    logPath: "/logs/",
    logFile: "log.txt",
    eventEmitter: testServer
})

logger.eventEmitter.on("INFO", (err) => {
    console.log(err)
})