const fs = require('fs');
const readline = require('readline');
const { exec } = require('child_process');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function main() {
  console.log('🚀 开始安装 Discord 工单机器人...\n');

  // 安装依赖
  exec('npm install discord.js dotenv', (err, stdout, stderr) => {
    if (err) {
      console.error('❌ 依赖安装失败:', err);
      rl.close();
      return;
    }
    
    console.log('✅ 依赖安装完成');
    console.log('\n🎉 安装完成！你可以使用以下命令启动机器人：');
    console.log('\n👉 第一步 node bot.js');
    console.log('\n👉 第二步 node ticketHandler.js');
    console.log('\n👌 以后使用 node bot.js 就行啦');
    console.log('\n🎉 然后你就能完整的使用机器人啦！');
    rl.close();
  });
}

main();