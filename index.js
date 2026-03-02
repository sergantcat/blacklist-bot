require("dotenv").config();

const express = require("express");
const { Client, GatewayIntentBits } = require("discord.js");

// ✅ keep Render alive
const app = express();
const PORT = process.env.PORT || 10000;

app.get("/", (req, res) => {
  res.send("Bot is alive!");
});

app.listen(PORT, () => {
  console.log(`🌐 Web server running on port ${PORT}`);
});

// ✅ create bot
const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

// ✅ when ready
client.once("ready", () => {
  console.log(`✅ Bot logged in as ${client.user.tag}`);
});

// ✅ interaction handler (simple test)
client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "blacklist") {
    await interaction.reply("User not found");
  }
});

// ✅ deploy commands WITHOUT blocking startup
(async () => {
  try {
    console.log("📦 Registering slash commands...");
    await require("./deploy-commands.js");
    console.log("✅ Slash commands registered");
  } catch (err) {
    console.error("❌ Command deploy failed:", err);
  }
})();

// ✅ login LAST
console.log("🔑 Attempting to log in...");
client.login(process.env.TOKEN);
