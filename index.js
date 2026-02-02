// ------------------ IMPORTS ------------------
import { Client, GatewayIntentBits } from "discord.js";
import express from "express";
import dotenv from "dotenv";

// ------------------ DOTENV ------------------
dotenv.config();

// ------------------ DISCORD CLIENT ------------------
const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// ------------------ READY EVENT ------------------
client.once("ready", () => {
  console.log(`🤖 Bot is ONLINE as ${client.user.tag}`);
});

// ------------------ LOGIN ------------------
console.log("ABOUT TO LOGIN TO DISCORD...");
client.login(process.env.bot_token)
  .then(() => console.log("✅ Logged into Discord successfully!"))
  .catch(err => console.error("❌ Discord login failed:", err));

// ------------------ EXPRESS WEB SERVER ------------------
const app = express();

app.get("/", (req, res) => {
  res.send("Bot is running!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌍 Web server running on port ${PORT}`);
});

// ------------------ OPTIONAL DEBUG ------------------
console.log("TOKEN length:", process.env.bot_token?.length || "NOT FOUND");
