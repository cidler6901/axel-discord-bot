require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express'); // tiny web server
const app = express();

// ---- Discord Bot ----
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

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'hi') {
        const channel = interaction.options.getChannel('channel');
        if (!channel) return interaction.reply({ content: 'Channel not found!', ephemeral: true });

        channel.send('hi'); // send "hi" in the selected channel
        interaction.reply({ content: `Sent hi in ${channel}`, ephemeral: true });
    }
});

client.login(process.env.DISCORD_TOKEN).catch(error => {
    console.error('Failed to log in to Discord. Check your token and bot configuration.', error);
    process.exit(1);
});

// ---- Web server for Render ----
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('Bot is running!'));
app.listen(PORT, () => console.log(`Web server listening on port ${PORT}`));
