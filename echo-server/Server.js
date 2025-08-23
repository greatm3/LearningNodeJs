import {User} from "./User.js";

export const userPool = {};

class Server {
    constructor (port, host) {
        this.port = port;
        this.host = host;

    }

    start() {
        // net.createServer((connection) => {
        //     this.#handleConnection(connection);
        // }).listen(this.port, this.host, () => {
        //     process.stdout.write("Server started: " + this.host + ":" + this.port)
        // })

        this.#handleConnection("test");
    }

    #handleConnection (connection) {
        this.client = User.createClient(connection);
        userPool[this.client.id] = this.client;
    }

}

export default Server;