require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");

console.log("TOKEN FOUND?", process.env.TOKEN ? "YES" : "NO");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once("ready", () => {
  console.log(`🤖 Bot is ONLINE as ${client.user.tag}`);
});

console.log("ABOUT TO LOGIN TO DISCORD...");

client.login(process.env.TOKEN)
  .then(() => console.log("✅ Logged into Discord successfully!"))
  .catch(err => console.error("❌ Discord login failed:", err));
