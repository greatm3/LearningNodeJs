import path from "path";
import fs from "fs";
import Server from "./Server.js";

class Logger {
    constructor({logPath, logFile, eventEmitter}) {
        this.logPath = path.join(process.cwd(), logPath);
        this.logFile = path.join(this.logPath, logFile);
        this.eventEmitter = eventEmitter;

        this.#createPathIfNotExists(this.logPath);
        this.#createFileIfNotExists(this.logFile);

        this.eventEmitter.on("LOGERROR", error => this.#log(error, "ERROR", new Date().toISOString()))
        this.eventEmitter.on("LOGINFO", info => this.#log(info, "INFO", new Date().toISOString()))
    }

    async #createPathIfNotExists(path) {
        await fs.mkdir(path, (err) => {
            if (err) {
                throw err;
            }
        })
    }

    async #createFileIfNotExists(path) {
        await fs.writeFile(path, "utf-8", (err) => {
            if (err) {
                throw err;
            }
        })
    }

    async #log(message, level, time) {
        const logMessage = `[${time}] ${level}: ${message}`

        await fs.appendFile(this.logFile, logMessage, err => {
            if (err) {
                throw err;
            }
        })
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