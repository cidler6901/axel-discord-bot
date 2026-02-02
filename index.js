import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";

dotenv.config();

console.log("BOT TOKEN LENGTH:", process.env.bot_token?.length);

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once("ready", () => {
  console.log(`🤖 Bot is ONLINE as ${client.user.tag}`);
});

client.login(process.env.bot_token)
  .then(() => console.log("✅ Login attempt sent"))
  .catch(err => console.error("❌ Discord login failed:", err));
console.log("BOT TOKEN:", process.env.bot_token?.slice(0, 5), "…");
