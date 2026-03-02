const { 
  Client, 
  GatewayIntentBits, 
  REST, 
  Routes, 
  SlashCommandBuilder, 
  PermissionsBitField,
  EmbedBuilder 
} = require("discord.js");
require("dotenv").config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

// ✅ SLASH COMMAND DATA
const commands = [
  new SlashCommandBuilder()
    .setName("blacklist")
    .setDescription("Blacklist a user from security")
    .addUserOption(option =>
      option.setName("user")
        .setDescription("User to blacklist")
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName("reason")
        .setDescription("Reason for blacklist")
        .setRequired(false)
    )
    .toJSON()
];

// ✅ REGISTER COMMANDS WHEN BOT STARTS
client.once("clientReady", async () => {
  console.log(`✅ Logged in as ${client.user.tag}`);

  const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

  try {
    console.log("🔄 Registering slash command...");

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    );

    console.log("✅ Slash command registered.");
  } catch (error) {
    console.error(error);
  }
});

// ✅ COMMAND HANDLER
client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "blacklist") {
    // Permission check
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
      return interaction.reply({
        content: "❌ You need Manage Roles permission.",
        ephemeral: true
      });
    }

    const user = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason") || "No reason provided.";

    const member = await interaction.guild.members.fetch(user.id);

    try {
      // ✅ GIVE ROLE
      await member.roles.add(process.env.BLACKLIST_ROLE_ID);

      // ✅ DM USER
      try {
        const dmEmbed = new EmbedBuilder()
          .setTitle("🚫 Blacklisted")
          .setDescription(`You have been blacklisted from security.\n\n**Reason:** ${reason}`)
          .setColor("Red");

        await user.send({ embeds: [dmEmbed] });
      } catch {
        console.log("Could not DM the user.");
      }

      // ✅ SUCCESS MESSAGE
      await interaction.reply({
        content: `✅ ${user.tag} has been blacklisted.`,
        ephemeral: false
      });

    } catch (err) {
      console.error(err);
      interaction.reply({
        content: "❌ Failed to blacklist user.",
        ephemeral: true
      });
    }
  }
});

client.login(process.env.TOKEN);