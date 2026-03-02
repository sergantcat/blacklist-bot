require('dotenv').config();

const express = require('express');
const {
  Client,
  GatewayIntentBits,
  SlashCommandBuilder,
  REST,
  Routes,
} = require('discord.js');

/* =======================
   KEEP-ALIVE WEB SERVER
======================= */

const app = express();
const PORT = process.env.PORT || 10000;

app.get('/', (req, res) => {
  res.send('Bot is alive!');
});

app.listen(PORT, () => {
  console.log(`🌐 Web server running on port ${PORT}`);
});

/* =======================
   DISCORD CLIENT
======================= */

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

/* =======================
   SLASH COMMAND DATA
======================= */

const commands = [
  new SlashCommandBuilder()
    .setName('blacklist')
    .setDescription('Blacklist a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to blacklist')
        .setRequired(true)
    )
    .toJSON(),
];

/* =======================
   REGISTER COMMANDS
======================= */

async function registerCommands() {
  try {
    console.log('🔄 Registering slash commands...');

    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    );

    console.log('✅ Slash commands registered');
  } catch (error) {
    console.error('❌ Command registration failed:', error);
  }
}

/* =======================
   BOT READY
======================= */

client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

/* =======================
   COMMAND HANDLER
======================= */

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'blacklist') {
    const user = interaction.options.getUser('user');

    await interaction.reply(
      `🚫 ${user.tag} has been blacklisted (demo).`
    );
  }
});

/* =======================
   START BOT
======================= */

(async () => {
  await registerCommands();

  console.log('🔑 Attempting to log in...');
  client.login(process.env.DISCORD_TOKEN);
})();
