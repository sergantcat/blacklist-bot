const { Client, GatewayIntentBits } = require("discord.js");
const express = require("express");
require("dotenv").config();

// 🔹 EXPRESS SERVER (REQUIRED FOR FREE RENDER WEB SERVICE)
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Bot is running!");
});

app.listen(PORT, () => {
  console.log(`🌐 Web server running on port ${PORT}`);
});

// 🔹 REGISTER SLASH COMMANDS
require("./deploy-commands.js");

// 🔹 DISCORD CLIENT
const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.once("ready", () => {
  console.log(`✅ Bot logged in as ${client.user.tag}`);
});

// 🔹 SLASH COMMAND HANDLER
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "blacklist") {
    const user = interaction.options.getUser("user");
    await interaction.reply(`🚫 ${user.tag} has been blacklisted.`);
  }
});

// 🔹 LOGIN
client.login(process.env.TOKEN);
