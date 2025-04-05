const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('close')
    .setDescription('关闭当前工单'),
  
  async execute(interaction) {
    const channel = interaction.channel;

    if (!channel.name.startsWith('ticket-')) {
      return interaction.reply({ content: '此频道不是一个工单。', ephemeral: true });
    }

    await interaction.reply('此工单将在 5 秒后关闭...');
    setTimeout(() => {
      channel.delete().catch(console.error);
    }, 5000);
  }
};
