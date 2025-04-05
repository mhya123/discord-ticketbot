const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('创建一个新的工单'),
  
  async execute(interaction) {
    const user = interaction.user;
    const guild = interaction.guild;

    const existing = guild.channels.cache.find(c => c.name === `ticket-${user.id}`);
    if (existing) {
      return interaction.reply({ content: '你已经有一个打开的工单了！', ephemeral: true });
    }

    const channel = await guild.channels.create({
      name: `ticket-${user.id}`,
      type: 0, // text channel
      permissionOverwrites: [
        {
          id: guild.roles.everyone,
          deny: [PermissionFlagsBits.ViewChannel],
        },
        {
          id: user.id,
          allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
        },
        {
          id: interaction.client.user.id,
          allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
        }
      ],
    });

    await channel.send(`🎫 工单已创建，<@${user.id}> 请说明你的问题。`);
    await interaction.reply({ content: `你的工单已创建: ${channel}`, ephemeral: true });
  }
};
