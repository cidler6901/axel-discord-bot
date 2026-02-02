require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

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

client.login(process.env.DISCORD_TOKEN);
