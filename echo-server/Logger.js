import path from "path";
import fs from "fs/promises";

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
        try {
            await fs.mkdir(path)
        } catch (error) {
            return false;
        }
    }

    async #createFileIfNotExists(path) {
        async function checkIfFileExists(path) {
            try {
                await fs.access(path);
                return true;
            } catch (error) {
                return false;
            }
        }

        if (!await checkIfFileExists(path)) {
            await fs.writeFile(path, "", "utf-8")
        }
    }

    async #log(message, level, time) {
        const logMessage = `[${time}] ${level}: ${message}\n`

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

export default Logger;