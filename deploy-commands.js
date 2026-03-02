const { REST, Routes, SlashCommandBuilder } = require("discord.js");
require("dotenv").config();

const commands = [
  new SlashCommandBuilder()
    .setName("blacklist")
    .setDescription("Blacklist a user")
    .addUserOption(option =>
      option
        .setName("user")
        .setDescription("User to blacklist")
        .setRequired(true)
    ),
].map(cmd => cmd.toJSON());

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log("🔄 Registering slash commands...");

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    );

    console.log("✅ Slash commands registered.");
  } catch (err) {
    console.error("❌ Command registration failed:", err);
  }
})();
