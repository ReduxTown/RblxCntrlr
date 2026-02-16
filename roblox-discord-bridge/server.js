const express = require("express");
const cors = require("cors");
const { Client, GatewayIntentBits } = require("discord.js");

const app = express();
app.use(cors());
app.use(express.json());

// Create Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Login using secret token
client.login(process.env.DISCORD_TOKEN);

// Endpoint for Roblox to send messages
app.post("/send", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) return res.status(400).send("No message provided");

    const channel = await client.channels.fetch(process.env.CHANNEL_ID);
    await channel.send(`📩 From Roblox:\n${message}`);

    res.send("Message sent to Discord!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error sending message");
  }
});

app.get("/", (req, res) => {
  res.send("Roblox-Discord bridge running.");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
