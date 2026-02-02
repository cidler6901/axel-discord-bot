require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const express = require("express");

/* -----------------------------
   ✅ DISCORD CLIENT
------------------------------*/
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

/* -----------------------------
   ✅ EXPRESS WEB SERVER (FOR PORT)
------------------------------*/
const app = express();

app.get("/", (req, res) => {
  res.send("Bot is running!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌍 Web server running on port ${PORT}`);
});

/* -----------------------------
   ✅ READY EVENT
------------------------------*/
client.once("ready", () => {
  console.log(`🤖 Bot is ONLINE as ${client.user.tag}`);
});

/* -----------------------------
   ✅ SIMPLE LOGIN
------------------------------*/
console.log("ABOUT TO LOGIN TO DISCORD...");

client.login(process.env.TOKEN)
  .then(() => console.log("✅ Logged into Discord successfully!"))
  .catch(err => console.error("❌ Discord login failed:", err));

/* -----------------------------
   ✅ OPTIONAL: SLASH COMMANDS
------------------------------*/
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "ping") {
    await interaction.reply("🏓 Pong!");
  }

  if (interaction.commandName === "hello") {
    await interaction.reply("Hello! 👋");
  }
});

/* -----------------------------
   ✅ OPTIONAL: ANTI-SPAM
------------------------------*/
const spamTracker = new Map();

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const userId = message.author.id;
  const content = message.content;

  if (!spamTracker.has(userId)) {
    spamTracker.set(userId, { lastMessage: "", count: 0, time: Date.now() });
  }

  const data = spamTracker.get(userId);

  if (content !== data.lastMessage) {
    data.lastMessage = content;
    data.count = 1;
    data.time = Date.now();
  } else {
    data.count++;
  }

  if (Date.now() - data.time > 30000) {
    data.count = 1;
    data.time = Date.now();
  }

  if (data.count >= 10) {
    data.count = 0;

    try {
      await message.author.send("🛑 Stop spamming!");
    } catch {}

    if (message.member?.moderatable) {
      try {
        await message.member.timeout(10 * 60 * 1000, "Spamming same message 10 times");
        message.channel.send(`⏳ ${message.author} has been timed out for spamming.`);
      } catch (err) {
        console.log("Timeout failed:", err);
      }
    }
  }
});
