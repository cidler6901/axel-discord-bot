require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const express = require("express");

/* -----------------------------
   ✅ DISCORD CLIENT
------------------------------*/
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

console.log("ABOUT TO LOGIN TO DISCORD...");

/* -----------------------------
   ✅ READY EVENT
------------------------------*/
client.once("ready", () => {
  console.log(`🤖 Bot is ONLINE as ${client.user.tag}`);
});

/* -----------------------------
   ✅ LOGIN
------------------------------*/
client.login(process.env.bot_token)
  .then(() => console.log("✅ Logged into Discord successfully!"))
  .catch(err => console.error("❌ Discord login failed:", err));

/* -----------------------------
   ✅ WEB SERVER (RENDER PORT)
------------------------------*/
const app = express();

app.get("/", (req, res) => {
  res.send("Bot is running!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌍 Web server running on port ${PORT}`);
});
console.log("TOKEN length:", process.env.TOKEN?.length || "NOT FOUND");
