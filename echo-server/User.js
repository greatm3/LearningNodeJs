class User {
    constructor (client, socket) {
        this.client = client;
        this.socket = socket;
        this.messageCount = 0;
        this.id = Math.floor((Math.random() * 10000) + new Date() / 5000);
    }

    sendMessage(message) {
        try {
            this.socket.write(message);
            this.messageCount++;
        } catch (error) {
            console.log("Error: " + error.message);
        }
    }

    disconnect() {
        this.socket.end();
    }

    static createClient (client, socket) {
        return new User(client, socket);
    }
}

export { User };