import express from "express";
import { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } from "discord.js";
import { Redis } from "@upstash/redis";
import dotenv from "dotenv";

dotenv.config();

/* ------------------ CHECK ENV ------------------ */
if (!process.env.PORT) {
  console.error("❌ No PORT defined! Render provides this automatically.");
  process.exit(1);
}
if (!process.env.bot_token) {
  console.error("❌ No bot_token defined in .env!");
  process.exit(1);
}

/* ------------------ EXPRESS SERVER ------------------ */
const app = express();
app.get("/", (req, res) => res.send("Bot is running!"));

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`🌍 Web server running on port ${PORT}`));

/* ------------------ REDIS ------------------ */
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

/* ------------------ DISCORD CLIENT ------------------ */
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once("ready", async () => {
  console.log(`🤖 Bot online as ${client.user.tag}`);

  if (process.env.UPDATE_COMMANDS === "true") {
    try {
      const commands = [
        new SlashCommandBuilder()
          .setName("ping")
          .setDescription("Replies with pong!"),
        new SlashCommandBuilder()
          .setName("report")
          .setDescription("Report a rule violation")
      ].map(cmd => cmd.toJSON());

      const rest = new REST({ version: "10" }).setToken(process.env.bot_token);
      await rest.put(Routes.applicationCommands(process.env.bot_id), { body: commands });
      console.log("✅ Slash commands registered!");
    } catch (err) {
      console.error("❌ Command registration failed:", err);
    }
  }
});

/* ------------------ BOT LOGIN ------------------ */
client.login(process.env.bot_token)
  .then(() => console.log("✅ Login attempt sent"))
  .catch(err => console.error("❌ Discord login failed:", err));

/* ------------------ SLASH COMMAND HANDLER ------------------ */
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "ping") {
    await interaction.reply("🏓 Pong!");
  }

  if (interaction.commandName === "report") {
    await interaction.reply("🚨 Report received!");
  }
});

/* ------------------ OPTIONAL: CASE COUNTER ------------------ */
async function getNextCaseNumber() {
  const current = await redis.get("caseCounter");
  const next = current ? Number(current) + 1 : 1;
  await redis.set("caseCounter", next);
  return next;
}
