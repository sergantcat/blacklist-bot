require('dotenv').config();
const { Client, GatewayIntentBits, Events } = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
});

client.once(Events.ClientReady, () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'blacklist') {
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason');

    const member = await interaction.guild.members.fetch(user.id);
    const role = interaction.guild.roles.cache.get(process.env.BLACKLIST_ROLE_ID);

    if (!role) {
      return interaction.reply({ content: 'Blacklist role not found.', ephemeral: true });
    }

    await member.roles.add(role);

    try {
      await user.send(`🚫 You have been blacklisted from security\nReason: ${reason}`);
    } catch {}

    await interaction.reply({ content: `✅ ${user.tag} blacklisted.`, ephemeral: true });
  }
});

client.login(process.env.TOKEN);
