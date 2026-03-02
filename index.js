require('dotenv').config();

const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');
const express = require('express');

console.log("🚀 Starting bot...");

// ===== Express keep-alive server =====
const app = express();
const PORT = process.env.PORT || 10000;

app.get('/', (req, res) => {
  res.send('Bot is alive!');
});

app.listen(PORT, () => {
  console.log(`🌐 Web server running on port ${PORT}`);
});

// ===== Discord client =====
const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// ===== Slash command =====
const commands = [
  new SlashCommandBuilder()
    .setName('blacklist')
    .setDescription('Blacklist a user')
].map(cmd => cmd.toJSON());

// ===== Register commands =====
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log('🔄 Registering slash commands...');

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    );

    console.log('✅ Slash commands registered');
  } catch (error) {
    console.error('❌ Command registration error:', error);
  }
})();

// ===== Bot ready =====
client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// ===== Login =====
console.log("🔑 Attempting to log in...");
client.login(process.env.DISCORD_TOKEN);
