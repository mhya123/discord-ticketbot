当然可以！下面是一篇完整的 **Discord Ticket Bot 使用教程**，适合放在 GitHub 项目 README、发给朋友或者自己做记录。

---

# 🎟️ Discord 工单机器人使用教程

一个支持按钮互动、日志记录、自动分配用户组、HTML 日志输出、频道归档、状态轮换的全功能工单机器人。

---

## ✅ 功能特色

- 创建技术支持/举报/投诉等多类型工单
- 只允许创建者与指定用户组查看频道内容
- 自动 @ 指定用户组，无需手动指派
- 日志以 HTML 格式存储，包含文字与图片
- 工单关闭后自动归档日志至指定频道
- Bot 状态轮换（如 “处理工单” / “帮助用户”等）
- 一键部署安装脚本（Node.js 环境）

---

## 📦 环境要求

- Node.js 16+（推荐 Node.js 18+）
- 拥有一个 Discord 机器人账号和 Token
- 一个 Discord 服务器 + 管理员权限

---

## 📁 项目结构

```bash
discord-bot/
├── bot.js                  # 主程序
├── setup.js               # 一键安装脚本（可选）
├── .env                   # 存放 BOT_TOKEN
├── commands/              # 存放 slash 命令
├── handlers/
│   ├── ticketHandler.js   # 工单创建与关闭处理逻辑
│   └── logs/              # 存储 HTML 日志的目录
└── ...
```

---

## ⚙️ 安装 & 启动

### 1. 克隆项目

```bash
git clone https://github.com/yourname/discord-ticket-bot.git
cd discord-ticket-bot
```

### 2. 创建 `.env` 文件

```env
BOT_TOKEN=你的Discord机器人Token
GUILD_ID=你的服务器ID（可选，Slash命令注册用）
LOG_CHANNEL_ID=归档日志的频道ID
TICKET_ROLE_ID=要@的管理用户组角色ID
```

> 💡 `LOG_CHANNEL_ID` 和 `TICKET_ROLE_ID` 可在 Discord 复制 ID 获取。

### 3. 安装依赖

```bash
node setup.js
```

> 或手动安装：

```bash
npm install discord.js dotenv
```

### 4. 启动机器人

```bash
node bot.js
```

---

## 🖱️ 使用方法

### 创建工单面板按钮

管理员可通过 `/ticket-setup` 命令创建一个带按钮的工单面板。

点击按钮后，会创建一个新频道（如 `ticket-support-myhai123`），**仅提工单人和管理组可见**。

---

## 🧾 日志系统说明

### 工单关闭时：

- 收集所有用户对话内容
- 生成一份 **美化后的 HTML 日志**
- 文件名包含时间戳，如 `ticket-support-用户ID-2025-04-05T13-12.html`
- 自动上传日志文件到指定频道
- 本地日志保存在 `/handlers/logs/`

### 示例：

```html
<h1>工单记录 - ticket-support-用户123</h1>
<p><strong>用户：</strong> @用户123</p>
<p><strong>时间：</strong> 2025-04-05 13:12</p>
<hr>
<div>
  <p><strong>用户123：</strong> 我需要帮助</p>
  <p><strong>BOT：</strong> 请详细说明问题</p>
  <p><strong>用户123：</strong> 图片如下：</p>
  <p><strong>图片：</strong><a href="图片地址" target="_blank">点击查看</a></p>
</div>
```

---

## 🤖 状态轮换

机器人登录后会自动轮换状态，例如：

- 正在处理工单
- 帮助用户
- 管理服务器
- 监听反馈
- 关注你的服务质量

每 10 秒自动切换一次。

---

## 📌 权限建议设置

- `@everyone` 不应能访问 Ticket 子频道
- 工单频道的权限由机器人自动设置，仅允许：
  - 发起工单的用户
  - 管理用户组（配置中的 `TICKET_ROLE_ID`）
  - Bot 本身

---

## 🚀 自定义开发（可选）

想扩展功能？你可以：

- 添加数据库支持（如 MySQL/MongoDB）
- 对接外部客服系统
- 添加 Web 后台面板（计划中）

---

## 💬 常见问题

### Q: 图片是否也能记录到日志？
A: 是的。日志中会以链接形式显示所有上传的图片、附件。

### Q: 可以自定义日志频道或角色吗？
A: 可以，通过 `.env` 中设置 `LOG_CHANNEL_ID` 和 `TICKET_ROLE_ID`。

### Q: 工单支持多种类型吗？
A: 是的，按钮可以配置为 “技术支持”、“举报”、“投诉”等，不同按钮创建不同类型工单。

---

## 📮 联系支持

如需帮助或定制开发，可联系作者：
- Discord：`HVHBBS#1640`
- Email：[可替换成你的邮箱]

---

如需我打包完整代码成 ZIP、写成 GitHub 项目模板，或集成更多管理功能（Web 管理面板等），也可以告诉我~ 😎
