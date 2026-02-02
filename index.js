const { Client, GatewayIntentBits } = require("discord.js");
require("dotenv").config();
const express = require("express");

// --------------------
// WEB SERVER (Render Port Fix)
// --------------------
const app = express();

app.get("/", (req, res) => {
  res.send("Bot is running!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌍 Web server running on port ${PORT}`);
});

// --------------------
// DISCORD CLIENT
// --------------------
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// --------------------
// TOKEN CHECK
// --------------------
console.log("TOKEN FOUND?", process.env.TOKEN ? "YES" : "NO");

// --------------------
// READY EVENT
// --------------------
client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// --------------------
// ANTI-SPAM SYSTEM
// --------------------
const spamTracker = new Map();

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const userId = message.author.id;
  const content = message.content;

  if (!spamTracker.has(userId)) {
    spamTracker.set(userId, {
      lastMessage: "",
      count: 0,
      time: Date.now(),
    });
  }

  const data = spamTracker.get(userId);

  // Reset if message changes
  if (content !== data.lastMessage) {
    data.lastMessage = content;
    data.count = 1;
    data.time = Date.now();
  } else {
    data.count++;
  }

  // Reset after 30 seconds
  if (Date.now() - data.time > 30000) {
    data.count = 1;
    data.time = Date.now();
  }

  // 10 same messages = spam
  if (data.count >= 10) {
    data.count = 0;

    // DM warning
    try {
      await message.author.send(
        "🛑 Stop spamming or you're going to be timed out for 10 minutes 😤"
      );
    } catch (err) {
      console.log("Could not DM user.");
    }

    // Timeout user
    if (message.member?.moderatable) {
      try {
        await message.member.timeout(
          10 * 60 * 1000,
          "Spamming same message 10 times"
        );

        await message.channel.send(
          `⏳ ${message.author} has been timed out for spamming.`
        );
      } catch (err) {
        console.log("Timeout failed:", err);
      }
    }
  }
});

// --------------------
// SLASH COMMANDS
// --------------------
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "ping") {
    return interaction.reply("🏓 Pong!");
  }

  if (interaction.commandName === "hello") {
    return interaction.reply("Hello! 👋");
  }
});

// --------------------
// LOGIN (ONLY ONCE)
// --------------------
console.log("ABOUT TO LOGIN TO DISCORD...");

client.login(process.env.TOKEN)
  .then(() => console.log("🔑 Discord login successful!"))
  .catch((err) => console.log("❌ Discord login failed:", err));
