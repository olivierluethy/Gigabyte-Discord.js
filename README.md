<div align="center">

# Gigabyte

<p><b>A Discord server-management bot built with discord.js.</b><br/>Moderation, server info, self-service roles and random GIF reactions for your community server.</p>

<p>
  <a href="LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-blue.svg"></a>
  <img alt="Node.js" src="https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white">
  <img alt="discord.js v12" src="https://img.shields.io/badge/discord.js-v12-5865F2?logo=discord&logoColor=white">
  <img alt="Giphy" src="https://img.shields.io/badge/Giphy-SDK-FF6666?logo=giphy&logoColor=white">
</p>

</div>

---

Gigabyte is a Node.js bot for administering a Discord server: a prefix command handler,
moderation commands, server/user info embeds and playful GIF replies powered by the Giphy
SDK. It is built on **discord.js v12**. The source comments are written in German.

## Features

- **Prefix command handler** — commands are matched against a configurable prefix (`sudo ` by default). A small helper in `command.js` lets you register aliases with a callback.
- **Moderation** — `ban` and `kick` mentioned members (requires the matching Discord permission) and post a random Giphy GIF to announce it.
- **Channel management** — create text and voice channels (`createtextchannel`, `createvoicechannel`) and bulk-clear a channel (`clearchannel` / `cc`), all gated behind the `ADMINISTRATOR` permission.
- **Server & user info** — `serverinfo` and `userinfo` reply with rich embeds; `server` reports guild name and member count.
- **Bot presence / status** — `status <text>` updates the bot's activity live.
- **Profanity filter** — messages containing blocked words are deleted with a warning.
- **First-message helper** — `first-message.js` posts (or edits) a pinned message in a channel and auto-adds reactions, handy for a role self-claim / rules message.
- **Giphy integration** — GIF search via the `giphy-js-sdk-core` package.

The command list is available in-chat via `sudo help`.

## Tech stack

- **Node.js**
- **[discord.js](https://discord.js.org/) v12** (`^12.5.1`)
- **[giphy-js-sdk-core](https://www.npmjs.com/package/giphy-js-sdk-core)** for GIFs

> Note: this bot targets discord.js **v12**. The API changed significantly in v13+
> (intents, `Intents`/`GatewayIntentBits`, method renames), so the code will not run
> unchanged on newer major versions.

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) installed
- A Discord bot application and token — create one in the
  [Discord Developer Portal](https://discord.com/developers/applications) (add a Bot,
  copy its token, and invite it to your server with the permissions it needs)
- A [Giphy API key](https://developers.giphy.com/) for the GIF commands

### Install

```bash
git clone https://github.com/olivierluethy/Gigabyte-Discord.js.git
cd Gigabyte-Discord.js
npm install
```

### Configure

Create a `config.json` in the project root:

```json
{
  "prefix": "sudo ",
  "token": "YOUR_DISCORD_BOT_TOKEN",
  "giphyToken": "YOUR_GIPHY_API_KEY"
}
```

| Field        | Description                                                         |
|--------------|---------------------------------------------------------------------|
| `prefix`     | The command prefix the bot listens for (e.g. `"sudo "`).            |
| `token`      | Your Discord bot token from the Developer Portal.                   |
| `giphyToken` | Your Giphy API key, used by the `ban`/`kick` GIF replies.           |

> Channel and category IDs (welcome channel, rules/info channel, the category new
> channels are created under) are defined as constants near the top of `index.js`.
> Replace them with the IDs from your own server before running.

### Run

```bash
node index.js
```

When it connects you'll see `Ready!` in the console and the bot's status will show
`"<prefix>help" for help`.

## License

Released under the [MIT License](LICENSE) © 2026 Olivier Lüthy. You're free to use, modify and distribute this
software, including commercially, as long as the copyright notice and license are included.

## Author

Built by **Olivier Lüthy** — [GitHub](https://github.com/olivierluethy).
