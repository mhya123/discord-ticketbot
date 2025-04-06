const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  PermissionFlagsBits
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup-ticket')
    .setDescription('发送一个工单面板（管理员使用）')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator), 

  async execute(interaction) {
    // 检查用户是否有管理员权限
    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({
        content: '❌ 你需要管理员权限才能使用此命令。',
        ephemeral: true,
      });
    }

    const embed = new EmbedBuilder()
      .setTitle('🎫 工单中心')
      .setDescription('请选择你的问题类型：')
      .setColor(0x3498db);

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('ticket_support')
        .setLabel('🛠️ 技术支持')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('ticket_report')
        .setLabel('🚨 举报')
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId('ticket_other')
        .setLabel('📩 投诉/其他')
        .setStyle(ButtonStyle.Secondary)
    );

    await interaction.reply({
      embeds: [embed],
      components: [row],
    });
  },
};
