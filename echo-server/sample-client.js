import net from "node:net";

const dummyMessages = [
  "Hello",
  "Hi",
  "How are you?",
  "I'm cool",
  "Good morning",
  "Good evening",
  "What's up?",
  "Hey there",
  "Long time no see",
  "How's it going?",
  "Nice to meet you",
  "See you later",
  "Take care",
  "What's new?",
  "All good?",
  "I'm fine, thanks",
  "Catch you soon"
]

const pickRandomMessage = () => {
  return dummyMessages[Math.floor(Math.random() * dummyMessages.length)]
}


const client = net.createConnection({ port: 59000 }, () => {
  console.log("Connected to server");
  client.write("sample-client")

  // send a random message every 4 seconds
  setInterval(() => {
    client.write(pickRandomMessage())
  }, 4000)

  process.on("SIGINT", () => {
    client.end();
  })

});
