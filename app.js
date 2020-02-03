/*
    [ Shift v2 ]
    Welcome your Discord server to a new realm.

    Created by the Shift Team (shiftbot.xyz)
    and Prmpt Group (prmpt.xyz).

    Copyright (c) Prmpt Group 2020. All rights reserved.
*/

const Discord = require("discord.js"),
  config = require("./configuration/config.js"),
  auth = require("./configuration/auth.js"),
  fs = require("fs"),
  r = require("rethinkdb"),
  package = require('./package.json');

const client = new Discord.Client({restTimeOffset: -Infinity});

client.db = require("rethinkdb");

client.log = require("./modules/logger.js");

client.log.info("Getting ready...");

client.log.info("Initializing database...");
r.connect(
  {
    db: "shift"
  },
  (err, conn) => {
    if (err) {
      client.log.warn(`Error while connecting to the database: \n${err.stack}`);
    } else {
      client.log.success("Connected to RethinkDB.");
      conn.use("shift");
      client.dbConn = conn;
    }
  }
);

// Ready event

client.on("ready", () => {
  client.util = {};
  fs.readdirSync("./utils").forEach(u => {
    let util = u.split(".js")[0];
    client.util[util] = require(`./utils/${u}`);
    client.log.success(`Successfully loaded the ${util} util.`);
  });
  if (client.guilds.size === 0)
    return client.log.warn(
      `This Discord bot isn't in any servers! Invite it using this link: https://discordapp.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot`
    );
  client.log.info(
    `Logged into Discord with the tag ${client.user.tag} and the ID ${client.user.id}.`
  );
  client.log.success("Ready.");
  client.user.setActivity("Shift | .help");
});

// Checking for guild config

function checkGuildDb(message, guildID) {
  r.table("guilds")
    .filter({
      id: guildID
    })
    .run(client.dbConn, (err, cursor) => {
      if (err) {
        client.log.error(err);
      } else {
        cursor.toArray((err, results) => {
          if (err) return client.log.error(err);
          if (results.length <= 0) {
            let defaultConf = require("./configuration/defaultDb/guild.js");
            defaultConf.id = message.guild.id;
            r.table("guilds")
              .insert(defaultConf)
              .run(client.dbConn, (err, cursor) => {
                if (err) return client.log.error(err);
                client.log.info(
                  `Added the default guild variables (specified in configuration/defaultDb/guild.js) to the database for ${message.guild.name} with the ID of ${message.guild.id}.`
                );
              });
          }
        });
      }
    });
}

// Message Event

client.on("message", async message => {
  try {
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;

    await checkGuildDb(message, message.guild.id);
    const userDB = (await r
      .table("users")
      .get(message.author.id)
      .run(client.dbConn));
  
    if (!userDB) {
      let defaultUserDb = require("./configuration/defaultDb/user.js");
      defaultUserDb.id = message.author.id;
      r.table("users")
        .insert(defaultUserDb)
        .run(client.dbConn, (err, cursor) => {
          if (err) return client.log.error(err);
          client.log.info(
            `Added the default user variables (specified in configuration/defaultDb/user.js) to the database for ${message.author.username} with the ID of ${message.author.id}.`
          );
        });
    }

    let guildConf = (
      await r
        .table("guilds")
        .get(message.guild.id)
        .run(client.dbConn)
    );
    let prefix;
    if (!guildConf) {
      prefix = '.';
    } else {
      prefix = guildConf.prefix;
    }
    if (!message.content.startsWith(prefix)) return;

    let isBlacklisted = (
      await r
        .table("users")
        .get(message.author.id)
        .run(client.dbConn)
    ).blacklist;
    if (isBlacklisted != false) {
      client.log.warn(
        `${message.author.username} (${message.author.id}) has been blocked from running a command due to their current blacklist.`
      );
      message.author.send({embed: client.util.embed(message, '❌ Oops... Looks like you\'ve been blacklisted from using this bot. Please contact Shift support if you believe this was a mistake. [Shift Server](https://discord.gg/4a6R7ev)', 'error')})
      return;
    }

    const args = message.content
      .slice(prefix.length)
      .trim()
      .split(/ +/g);
    const command = args.shift().toLowerCase();

    try {
      const cmdFile = require(`./commands/${command}`);
      if (cmdFile) {
        try {
          cmdFile(client, message, args);
        } catch (err) {
          client.log.error(
            `An error has occured while running the ${command} command. Here's the details: \n${err.stack}`
          );
          message.channel.send({
            embed: client.util.embed(
              message,
              `Uh oh. Something went wrong while running that command. I've DMed you the details. If you continue to get this error, please contact Shift support. [Shift Server](https://discord.gg/4a6R7ev)`,
              "error"
            )
          });
          message.author.send({
            embed: client.util.embed(
              message,
              `Uh oh. Something went wrong while running the \`${command}\` command in ${message.guild.name} (${message.guild.id}). Here\'s the details: \n\`\`\`md\n${err.stack}\`\`\``,
              "error"
            )
          });
        }
      }
      client.log.info(
        `${message.author.tag} has executed the ${command} command in ${message.guild.name}.`
      );
    } catch (err) {
      if (!fs.existsSync(`./commands/${command}.js`)) return;
      client.log.error(
        `An error has occured while running the ${command} command. Here's the details: \n${err.stack}`
      );
      message.channel.send({
        embed: client.util.embed(
          message,
          `Uh oh. Something went wrong while running that command. I've DMed you the details. If you continue to get this error, please contact Shift support. [Shift Server](https://discord.gg/4a6R7ev)`,
          "error"
        )
      });
      message.author.send({
        embed: client.util.embed(
          message,
          `Uh oh. Something went wrong while running the \`${command}\` command in ${message.guild.name} (${message.guild.id}). Here\'s the details: \n\`\`\`md\n${err.stack}\`\`\``,
          "error"
        )
      });
    }
  } catch (err) {
    client.log.error(
      `An error has occured. Here's the details: \n${err.stack}`
    );
    message.channel.send({
      embed: client.util.embed(
        message,
        `Uh oh. Something went wrong. I've DMed you the details. If you continue to get this error, please contact Shift support. [Shift Server](https://discord.gg/4a6R7ev)`,
        "error"
      )
    });
    message.author.send({
      embed: client.util.embed(
        message,
        `Uh oh. Something went wrong in ${message.guild.name} (${message.guild.id}). Here\'s the details: \n\`\`\`md\n${err.stack}\`\`\``,
        "error"
      )
    });
  }
});

// guildMemberAdd

client.on('guildMemberAdd', async (member) => {
  checkGuildDb(member, member.guild.id);

  let welcomeStatus = (await client.db.table('guilds').get(member.guild.id).run(client.dbConn)).welcomeMessages;
  let logStatus = (await client.db.table('guilds').get(member.guild.id).run(client.dbConn)).logging;

  let guild = member.guild;

  if (welcomeStatus != false) {
    let channel = (await client.db.table('guilds').get(member.guild.id).run(client.dbConn)).welcomeChannel;
    let msg = (await client.db.table('guilds').get(member.guild.id).run(client.dbConn)).welcomeMsg.replace('{user}', member.user.tag).replace('{server}', guild.name);

    client.channels.find(c => c.id === channel).send({embed: {
      author: {
        name: `Hey ${member.user.username}`,
        icon_url: member.user.avatarURL()
      },
      description: msg,
      color: 0x36393F,
      footer: {
        text: `v${package.version}`
      }
    }})

    client.log.info(`${member.user.username} has just joined ${guild.name}. I have logged this appropriately.`);
  } else {
    client.log.info(`${member.user.username} has just joined ${guild.name}. I have logged this appropriately.`);
  }

  if (logStatus != false) {
    let channel = (await client.db.table('guilds').get(member.guild.id).run(client.dbConn)).logChannel;
    let createdDate = new Date(member.user.createdTimestamp);
    let createdAt = `${createdDate.getDate()}/${createdDate.getMonth() + 1}/${createdDate.getFullYear()}`;

    let joinedDate = new Date(member.joinedTimestamp);
    let joinedAt = `${joinedDate.getDate()}/${joinedDate.getMonth() + 1}/${joinedDate.getFullYear()}`;

    client.channels.find(c => c.id === channel).send({embed: {
      author: {
        name: client.user.username,
        icon_url: client.user.avatarURL()
      },
      description: `${member.user.tag} has just joined the server.`,
      fields: [
        {
          name: '🆔 ID',
          value: member.user.id,
          inline: true
        },
        {
          name: '😀 Joined Discord',
          value: createdAt,
          inline: true
        },
        {
          name: '🏠 Joined Server',
          value: joinedAt,
          inline: true
        }
      ],
      color: 0x36393F,
      timestamp: new Date(),
      footer: {
        text: `v${package.version}`
      }
    }})
  }
})

// guildMemberRemove

client.on('guildMemberRemove', async (member) => {
  checkGuildDb(member, member.guild.id);

  let leaveStatus = (await client.db.table('guilds').get(member.guild.id).run(client.dbConn)).leaveMessages;
  let logStatus = (await client.db.table('guilds').get(member.guild.id).run(client.dbConn)).logging;

  let guild = member.guild;

  if (leaveStatus != false) {
    let channel = (await client.db.table('guilds').get(member.guild.id).run(client.dbConn)).leaveChannel;
    let msg = (await client.db.table('guilds').get(member.guild.id).run(client.dbConn)).leaveMsg.replace('{user}', member.user.tag).replace('{server}', guild.name);

    client.channels.find(c => c.id === channel).send({embed: {
      author: {
        name: `Bye ${member.user.username}`,
        icon_url: member.user.avatarURL()
      },
      description: msg,
      color: 0x36393F,
      footer: {
        text: `v${package.version}`
      }
    }})

    client.log.info(`${member.user.tag} has just left ${guild.name}. I have logged this appropriately.`);
  } else {
    client.log.info(`${member.user.tag} has just left ${guild.name}. I have logged this appropriately.`);
  }

  if (logStatus != false) {
    let channel = (await client.db.table('guilds').get(member.guild.id).run(client.dbConn)).logChannel;
    let createdDate = new Date(member.user.createdTimestamp);
    let createdAt = `${createdDate.getDate()}/${createdDate.getMonth() + 1}/${createdDate.getFullYear()}`;

    let joinedDate = new Date(member.joinedTimestamp);
    let joinedAt = `${joinedDate.getDate()}/${joinedDate.getMonth() + 1}/${joinedDate.getFullYear()}`;

    client.channels.find(c => c.id === channel).send({embed: {
      author: {
        name: client.user.username,
        icon_url: client.user.avatarURL()
      },
      description: `${member.user.tag} has just left the server.`,
      fields: [
        {
          name: '🆔 ID',
          value: member.user.id,
          inline: true
        },
        {
          name: '😀 Joined Discord',
          value: createdAt,
          inline: true
        },
        {
          name: '🏠 Joined Server',
          value: joinedAt,
          inline: true
        }
      ],
      color: 0x36393F,
      timestamp: new Date(),
      footer: {
        text: `v${package.version}`
      }
    }})
  }
});

// guildBanAdd

client.on('guildBanAdd', async (guild, user) => {
  let logStatus = (await client.db.table('guilds').get(guild.id).run(client.dbConn)).logging;

  if (logStatus != false) {
    let channel = (await client.db.table('guilds').get(guild.id).run(client.dbConn)).logChannel;

    let createdDate = new Date(user.createdTimestamp);
    let createdAt = `${createdDate.getDate()}/${createdDate.getMonth() + 1}/${createdDate.getFullYear()}`;

    client.channels.find(c => c.id === channel).send({embed: {
      author: {
        name: client.user.username,
        icon_url: client.user.avatarURL()
      },
      description: `${user.tag} has been banned from the server.`,
      fields: [
        {
          name: '🆔 ID',
          value: user.id,
          inline: true
        },
        {
          name: '😀 Joined Discord',
          value: createdAt,
          inline: true
        }
      ],
      color: 0x36393F,
      timestamp: new Date(),
      footer: {
        text: `v${package.version}`
      }
    }})
  }
})

// guildBanRemove

client.on('guildBanRemove', async (guild, user) => {
  let logStatus = (await client.db.table('guilds').get(guild.id).run(client.dbConn)).logging;

  if (logStatus != false) {
    let channel = (await client.db.table('guilds').get(guild.id).run(client.dbConn)).logChannel;

    let createdDate = new Date(user.createdTimestamp);
    let createdAt = `${createdDate.getDate()}/${createdDate.getMonth() + 1}/${createdDate.getFullYear()}`;

    client.channels.find(c => c.id === channel).send({embed: {
      author: {
        name: client.user.username,
        icon_url: client.user.avatarURL()
      },
      description: `${user.tag} has been unbanned from the server.`,
      fields: [
        {
          name: '🆔 ID',
          value: user.id,
          inline: true
        },
        {
          name: '😀 Joined Discord',
          value: createdAt,
          inline: true
        }
      ],
      color: 0x36393F,
      timestamp: new Date(),
      footer: {
        text: `v${package.version}`
      }
    }})
  }
});

client.on('messageDelete', async (message) => {
  if (!message.guild) return;
  let logStatus = (await client.db.table('guilds').get(message.guild.id).run(client.dbConn)).logging;

  if (logStatus != false) {
    let channel = (await client.db.table('guilds').get(message.guild.id).run(client.dbConn)).logChannel;

    client.channels.find(c => c.id === channel).send({embed: {
      author: {
        name: client.user.username,
        icon_url: client.user.avatarURL()
      },
      description: `A message from ${message.author.tag} has been deleted.`,
      fields: [
        {
          name: '🔤 Content',
          value: message.content,
          inline: true
        }
      ],
      color: 0x36393F,
      timestamp: new Date(),
      footer: {
        text: `v${package.version}`
      }
    }})
  }
});

client.on('messageDeleteBulk', async (messages) => {
  if (!messages.first().guild) return;
  let logStatus = (await client.db.table('guilds').get(messages.first().guild.id).run(client.dbConn)).logging;

  if (logStatus != false) {
    let hastebinContent = `Shift Bulk Delete Logs for ${new Date()}\n---------------------------------------------------------------------------------------------`;
    let channel = (await client.db.table('guilds').get(messages.first().guild.id).run(client.dbConn)).logChannel;
    messages.forEach(msg => {
      if (!msg.content) {
        hastebinContent = hastebinContent + `\n[${msg.author.tag} | ${msg.channel.name}] EMBED (most likely a bot)`;
      } else {
        hastebinContent = hastebinContent + `\n[${msg.author.tag} | ${msg.channel.name}] ${msg.content}`;
      }
    })
  
    require('snekfetch').post('https://hasteb.in/documents', {data: hastebinContent}).then(res => {
      if (res.body.key) {
        client.channels.find(c => c.id === channel).send({embed: {
          author: {
            name: client.user.username,
            icon_url: client.user.avatarURL()
          },
          description: `Some messages have been deleted from ${messages.first().channel.name}.`,
          fields: [
            {
              name: '📎 Link',
              value: `[Click Here](https://hasteb.in/${res.body.key}.md)`,
              inline: true
            }
          ],
          color: 0x36393F,
          timestamp: new Date(),
          footer: {
            text: `v${package.version}`
          }
        }})
      } else {
        client.log.error('Something went wrong while trying to post something to hatebin. Is it down?')
      }
    })
  }
})

client.on('messageUpdate', async (oldMessage, newMessage) => {
  if (!oldMessage.guild) return;
  let logStatus = (await client.db.table('guilds').get(oldMessage.guild.id).run(client.dbConn)).logging;
  if (oldMessage.author.bot) return;

  if (logStatus != false) {
    let channel = (await client.db.table('guilds').get(oldMessage.guild.id).run(client.dbConn)).logChannel;

    client.channels.find(c => c.id === channel).send({embed: {
      author: {
        name: client.user.username,
        icon_url: client.user.avatarURL()
      },
      description: `${oldMessage.author.tag}'s message was edited.`,
      fields: [
        {
          name: '👈 Previous Message',
          value: oldMessage.content || 'No content.',
          inline: true
        },
        {
          name: '📩 New Message',
          value: newMessage.content || 'No content.',
          inline: true,
        },
        {
          name: '#️⃣ Channel',
          value: newMessage.channel.name,
          inline: true
        }
      ],
      color: 0x36393F,
      timestamp: new Date(),
      footer: {
        text: `v${package.version}`
      }
    }})
  }
});

client.on('error', err => client.log.error(`Oops. Something went wrong. Here's the details: \n${err}`));

client.login(auth.token);
