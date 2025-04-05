const { Client, GatewayIntentBits, Events, Collection } = require('discord.js');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const handleTicket = require('./handlers/ticketHandler');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

client.once(Events.ClientReady, () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (command) await command.execute(interaction);
  }

  if (interaction.isButton()) {
    const id = interaction.customId;

    if (id.startsWith('ticket_')) {
      const type = id.split('_')[1];
      return handleTicket(interaction, type);
    }

    if (id === 'close_ticket') {
      const channel = interaction.channel;
      const messages = await channel.messages.fetch({ limit: 100 });
      const log = messages
        .filter(m => !m.author.bot)
        .map(m => `${m.author.tag}: ${m.content}`)
        .reverse()
        .join('\n');

      const fileName = `./logs/${channel.name}.txt`;
      fs.writeFileSync(fileName, log);
      await interaction.reply('🔒 正在关闭工单，日志已保存。');
      setTimeout(() => {
        channel.delete().catch(console.error);
      }, 3000);
    }
  }
});

// 轮换的活动列表
const activities = [
    { name: 'hvhbbs.cc', type: 0 }, // "Playing"
    { name: 'Ticket', type: 0 },  // "Playing"
    { name: '不要交流违法内容', type: 0 }, // "Playing"
    { name: '有问题开ticket', type: 2 }, // "Listening"
    { name: '管理员都会处理你的工单', type: 3 },  // "Watching"
  ];
  
  // 轮换间隔时间（毫秒）
  const rotateInterval = 30000; // 每10秒轮换一次
  
  let currentActivityIndex = 0;
  
  // 设置自定义状态并开始轮换
  client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
  
    // 设置初始状态
    setActivity();
  
    // 启动状态轮换
    setInterval(() => {
      currentActivityIndex = (currentActivityIndex + 1) % activities.length;
      setActivity();
    }, rotateInterval);
  });
  
  // 更新机器人的状态
  function setActivity() {
    const activity = activities[currentActivityIndex];
  
    client.user.setPresence({
      activities: [
        {
          name: activity.name,
          type: activity.type, // 活动类型：0 = "Playing", 1 = "Streaming", 2 = "Listening", 3 = "Watching"
        },
      ],
      status: 'online', // 设置为在线状态
    });
  
    console.log(`Bot activity set to: ${activity.name}`);
  }
  
client.login(process.env.TOKEN);
