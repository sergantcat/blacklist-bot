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

// ================= EXPRESS (RENDER FIX) =================
const app = express();

app.get("/", (req, res) => {
  res.send("Bot is alive");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Web server ready on port ${PORT}`);
});

// ================= ENV =================
const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

// 🔴 PUT YOUR ROLE ID HERE
const BLACKLIST_ROLE = "1467522291322847425";

// ================= CLIENT =================
const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

// ================= REGISTER COMMAND =================
const command = new SlashCommandBuilder()
  .setName("blacklist")
  .setDescription("Blacklist a user")
  .addUserOption(option =>
    option.setName("user").setDescription("User").setRequired(true)
  )
  .addStringOption(option =>
    option.setName("reason").setDescription("Reason").setRequired(true)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles);

const rest = new REST({ version: "10" }).setToken(TOKEN);

(async () => {
  try {
    console.log("Registering slash command...");
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: [command.toJSON()] }
    );
    console.log("Slash command registered.");
  } catch (err) {
    console.error(err);
  }
})();

// ================= READY =================
client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

// ================= COMMAND =================
client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "blacklist") {
    const user = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason");

    const member = await interaction.guild.members.fetch(user.id).catch(() => null);

    if (!member) {
      return interaction.reply({
        content: "User not found in this server.",
        ephemeral: true,
      });
    }

    try {
      await member.roles.add(BLACKLIST_ROLE);

      const embed = new EmbedBuilder()
        .setTitle("You were blacklisted")
        .setDescription(`Reason: ${reason}`)
        .setColor(0xff0000);

      await user.send({ embeds: [embed] }).catch(() => {});

      await interaction.reply({
        content: `✅ ${user.tag} has been blacklisted.`,
      });
    } catch (err) {
      console.error(err);
      await interaction.reply({
        content: "❌ Failed to blacklist user.",
        ephemeral: true,
      });
    }
  }
});

// ================= LOGIN =================
client.login(TOKEN);
