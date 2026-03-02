const { Client, GatewayIntentBits } = require("discord.js");
require("dotenv").config();

// 🔥 THIS AUTO-REGISTERS SLASH COMMANDS
require("./deploy-commands.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.once("ready", () => {
  console.log(`✅ Bot is alive as ${client.user.tag}`);
});

// Handle slash commands
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "blacklist") {
    const user = interaction.options.getUser("user");
    await interaction.reply(`🚫 ${user.tag} has been blacklisted.`);
  }
});

// 🔥 REQUIRED FOR RENDER
const PORT = process.env.PORT || 3000;

client.login(process.env.TOKEN);
