import { Client, GatewayIntentBits } from "discord.js";
import express from "express";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once("ready", () => {
  console.log(`🤖 Bot online as ${client.user.tag}`);
});

client.login(process.env.bot_token)
  .then(() => console.log("✅ Logged in"))
  .catch(err => console.error("❌ Login failed:", err));

const app = express();
app.get("/", (req, res) => res.send("Bot is running!"));
app.listen(process.env.PORT || 3000, () =>
  console.log(`🌍 Web server running on port ${process.env.PORT || 3000}`)
);
