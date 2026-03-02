const express = require("express");
const {
  Client,
  GatewayIntentBits,
  SlashCommandBuilder,
  REST,
  Routes,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");

// ===== KEEP RENDER BOT ALIVE =====
const app = express();
app.get("/", (req, res) => res.send("Bot is alive!"));
app.listen(3000, () => console.log("Web server ready"));

// ===== ENV VARIABLES =====
const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

// ===== ROLE ID (CHANGE IF NEEDED) =====
const BLACKLIST_ROLE = "1467497874320261304";

// ===== DISCORD CLIENT =====
const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

// ===== REGISTER SLASH COMMAND =====
const command = new SlashCommandBuilder()
  .setName("blacklist")
  .setDescription("Blacklist a user from security")
  .addUserOption((option) =>
    option.setName("user").setDescription("User to blacklist").setRequired(true)
  )
  .addStringOption((option) =>
    option.setName("reason").setDescription("Reason for blacklist").setRequired(true)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles);

const rest = new REST({ version: "10" }).setToken(TOKEN);

(async () => {
  try {
    console.log("Registering slash command...");
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
      body: [command.toJSON()],
    });
    console.log("Slash command registered.");
  } catch (error) {
    console.error(error);
  }
})();

// ===== BOT READY =====
client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

// ===== COMMAND HANDLER =====
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "blacklist") {
    const user = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason");

    const member = await interaction.guild.members.fetch(user.id).catch(() => null);

    if (!member) {
      return interaction.reply({
        content: "User not found
