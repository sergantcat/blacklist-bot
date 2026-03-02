import {
  Client,
  GatewayIntentBits,
  PermissionsBitField,
  EmbedBuilder
} from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName !== 'blacklist') return;

  // Permission check
  if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
    return interaction.reply({
      content: '❌ You need Manage Roles permission.',
      ephemeral: true
    });
  }

  const user = interaction.options.getUser('user');
  const reason = interaction.options.getString('reason');
  const member = await interaction.guild.members.fetch(user.id);

  try {
    // Give role
    await member.roles.add(process.env.BLACKLIST_ROLE_ID);

    // DM embed
    const embed = new EmbedBuilder()
      .setTitle('🚫 Blacklisted')
      .setDescription('You have been blacklisted from security.')
      .addFields({ name: 'Reason', value: reason })
      .setColor('Red')
      .setTimestamp();

    try {
      await user.send({ embeds: [embed] });
    } catch {}

    await interaction.reply({
      content: `✅ ${user.tag} has been blacklisted.`
    });

  } catch (err) {
    console.error(err);
    await interaction.reply({
      content: '❌ Failed to blacklist user.',
      ephemeral: true
    });
  }
});

client.login(process.env.TOKEN);
