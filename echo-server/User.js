class User {
    constructor(socket) {
        this.socket = socket;
        this.messageCount = 0;
    }

    static createClient(client, socket) {
        return new User(client, socket);
    }
}

export default User;