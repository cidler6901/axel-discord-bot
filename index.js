require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express'); // tiny web server
const app = express();

// ---- Discord Bot ----
const token =
    process.env.DISCORD_TOKEN ||
    process.env.BOT_TOKEN ||
    process.env.TOKEN;

if (!token) {
    console.error('Missing DISCORD_TOKEN/BOT_TOKEN/TOKEN in environment. Create a .env file or set it in your host settings.');
    process.exit(1);
} else {
    const tokenSource = process.env.DISCORD_TOKEN ? 'DISCORD_TOKEN' : process.env.BOT_TOKEN ? 'BOT_TOKEN' : 'TOKEN';
    console.log(`Using ${tokenSource} for Discord authentication.`);
if (!process.env.DISCORD_TOKEN) {
    console.error('Missing DISCORD_TOKEN in environment. Create a .env file or set it in your host settings.');
    process.exit(1);
}

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});

process.on('uncaughtException', error => {
    console.error('Uncaught exception:', error);
});

client.on('warn', info => {
    console.warn('Discord client warning:', info);
});

client.on('error', error => {
    console.error('Discord client error:', error);
});

client.on('shardError', error => {
    console.error('Discord shard error:', error);
});

client.on('shardDisconnect', (event, shardId) => {
    const eventCode = event && 'code' in event ? event.code : undefined;
    const eventReason = event && 'reason' in event ? event.reason : undefined;
    console.warn(`Discord shard ${shardId} disconnected:`, eventCode, eventReason);
    console.warn(`Discord shard ${shardId} disconnected:`, event?.code, event?.reason);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'hi') {
        const channel = interaction.options.getChannel('channel');
        if (!channel) return interaction.reply({ content: 'Channel not found!', ephemeral: true });

        channel.send('hi'); // send "hi" in the selected channel
        interaction.reply({ content: `Sent hi in ${channel}`, ephemeral: true });
    }
});

client.login(token).catch(error => {
client.login(process.env.DISCORD_TOKEN).catch(error => {
    console.error('Failed to log in to Discord. Check your token and bot configuration.', error);
    process.exit(1);
});

// ---- Web server for Render ----
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('Bot is running!'));
app.listen(PORT, () => console.log(`Web server listening on port ${PORT}`));
