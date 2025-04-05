const {
    PermissionFlagsBits,
    ChannelType,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
  } = require('discord.js');
  const fs = require('fs');
  const path = require('path');
  require('dotenv').config();
  
  module.exports = async function handleTicket(interaction, type) {
    const user = interaction.user;
    const guild = interaction.guild;
    const typeNames = {
      support: '技术支持',
      report: '举报',
      other: '投诉/其他'
    };
  
    const channelName = `ticket-${type}-${user.username.toLowerCase()}`;
    const existing = guild.channels.cache.find(c => c.name === channelName);
    if (existing) {
      return interaction.reply({ content: '你已有一个未关闭的此类型工单。', ephemeral: true });
    }
  
    const channel = await guild.channels.create({
      name: channelName,
      type: ChannelType.GuildText,
      permissionOverwrites: [
        { id: guild.roles.everyone, deny: [PermissionFlagsBits.ViewChannel] },
        { id: user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
        { id: process.env.HANDLER_ROLE_ID, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
        { id: interaction.client.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] }
      ]
    });
  
    // 自动 @ 指定用户组
    const handlerRole = guild.roles.cache.get(process.env.HANDLER_ROLE_ID);
    let mention = '';
  
    if (handlerRole) {
      mention = `👮 提醒用户组：<@&${handlerRole.id}>，请处理此工单！`;
    } else {
      mention = '⚠️ 无法找到指定用户组！';
    }
  
    const closeButton = new ButtonBuilder()
      .setCustomId('close_ticket')
      .setLabel('关闭工单')
      .setStyle(ButtonStyle.Danger)
      .setEmoji('🔒');
  
    const row = new ActionRowBuilder().addComponents(closeButton);
  
    const embed = new EmbedBuilder()
      .setTitle(`📨 ${typeNames[type]} 工单`)
      .setDescription(`<@${user.id}> 请在此详细描述你的问题。\n\n${mention}`)
      .setColor(0x2ecc71)
      .setTimestamp();
  
    await channel.send({ embeds: [embed], components: [row] });

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const logFilePath = path.join(__dirname, 'logs', `ticket-support-${user.username}-${timestamp}.html`);

    const cssStyles = `
<style>
    :root {
        --primary-color: #2ecc71;
        --secondary-color: #27ae60;
        --background: #f8f9fa;
        --text-color: #2d3436;
        --card-bg: #ffffff;
        --shadow: rgba(0, 0, 0, 0.08);
    }

    body {
        font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
        background-color: var(--background);
        margin: 0;
        padding: 2rem 1rem;
        color: var(--text-color);
        line-height: 1.7;
    }

    .container {
        max-width: 800px;
        margin: 0 auto;
        animation: fadeIn 0.6s ease;
    }

    .header {
        text-align: center;
        padding: 2rem;
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        color: white;
        border-radius: 16px;
        margin-bottom: 2rem;
        box-shadow: 0 4px 6px var(--shadow);
        transition: transform 0.2s ease;
    }

    .header:hover {
        transform: translateY(-2px);
    }

    h1 {
        font-size: 2.2rem;
        margin: 0;
        font-weight: 700;
        letter-spacing: -0.5px;
    }

    .metadata {
        background: var(--card-bg);
        padding: 1.5rem;
        border-radius: 12px;
        margin: 1.5rem 0;
        box-shadow: 0 2px 4px var(--shadow);
    }

    .metadata p {
        margin: 0.8rem 0;
        font-size: 0.95rem;
    }

    .message {
        background: var(--card-bg);
        padding: 1.2rem;
        border-radius: 12px;
        margin: 1rem 0;
        box-shadow: 0 2px 4px var(--shadow);
        border-left: 4px solid var(--primary-color);
        transition: all 0.2s ease;
    }

    .message:hover {
        transform: translateX(5px);
        box-shadow: 0 4px 8px var(--shadow);
    }

    .message-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 0.8rem;
    }

    .author {
        font-weight: 600;
        color: var(--primary-color);
    }

    .timestamp {
        font-size: 0.85rem;
        color: #7f8c8d;
    }

    .attachment {
        margin-top: 1rem;
        padding: 0.8rem;
        background: #f8f9fa;
        border-radius: 8px;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
    }

    .attachment a {
        color: #3498db;
        text-decoration: none;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .attachment a:hover {
        color: #2980b9;
        text-decoration: underline;
    }

    .footer {
        text-align: center;
        margin-top: 3rem;
        padding: 1.5rem;
        color: #7f8c8d;
        font-size: 0.9rem;
        border-top: 1px solid #ecf0f1;
    }

    @media (max-width: 640px) {
        .container {
            padding: 0 1rem;
        }

        .header {
            padding: 1.5rem;
            border-radius: 12px;
        }

        h1 {
            font-size: 1.8rem;
        }

        .message {
            padding: 1rem;
        }
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
</style>
    `;
    
    const htmlHeader = `<!DOCTYPE html><html><head><title>工单日志 - ${channelName}</title>${cssStyles}</head><body>`;
    const htmlFooter = `<div class="footer"><p>本工单由 Discord 机器人记录。</p></div></body></html>`;
    let htmlContent = htmlHeader + `<div class="header"><h1>工单日志 - ${channelName}</h1></div><p><strong>工单类型：</strong>${typeNames[type]}</p><p><strong>创建人：</strong><a href="https://discord.com/users/${user.id}">${user.tag}</a></p><hr/>`;
  
    // 监听消息并记录
    const filter = m => m.guild.id === guild.id && m.channel.id === channel.id;
    const collector = channel.createMessageCollector({ filter, time: 24 * 60 * 60 * 1000 }); // 24小时内记录消息
  
    collector.on('collect', async (message) => {
      let messageContent = `
        <div class="message">
          <p><strong>${message.author.tag}</strong> <em>(${message.createdAt.toLocaleString()})</em>: ${message.content}</p>
      `;
  
      // 检查是否包含图片
      if (message.attachments.size > 0) {
        message.attachments.forEach((attachment) => {
          messageContent += `
            <div class="attachment">
              <strong>图片/文件：</strong><a href="${attachment.url}" target="_blank">点击查看</a>
            </div>
          `;
        });
      }
  
      messageContent += `</div>`;
      htmlContent += messageContent;
  
      // 更新日志文件
      fs.writeFileSync(logFilePath, htmlContent);
    });
  
    collector.on('end', async () => {
      htmlContent += htmlFooter;
      fs.writeFileSync(logFilePath, htmlContent); // 24小时后关闭文件并保存
  
      // 发送日志文件到指定频道
      const logChannel = guild.channels.cache.get(process.env.LOG_CHANNEL_ID);
      if (logChannel) {
        try {
          await logChannel.send({
            content: `工单日志已生成，点击下载：`,
            files: [{ attachment: logFilePath, name: `ticket-support-${user.username}-${timestamp}.html` }]
          });
        } catch (error) {
          console.error('发送日志文件失败:', error);
        }
      }
    });
  
    await interaction.reply({ content: `你的工单已创建：${channel}`, ephemeral: true });
  };
  