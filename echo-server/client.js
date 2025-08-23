class Client {
    constructor (client, socket) {
        this.client = client;
        this.socket = socket;
        this.messageCount = 0;
        this.id = Math.floor((Math.random() * 10000) + new Date() / 5000);
    }

    static createClient (client, socket) {
        return new Client(client, socket);
    }
}

const client = Client.createClient(133, "SOCKET")

console.log(client);