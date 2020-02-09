module.exports = async (client, message, args) => {
    if (!message.member.hasPermission('ADMINISTRATOR')) {
        if (!require('../configuration/config.js').maintainers.includes(message.author.id)) {
            message.channel.send({
                embed: client.util.embed(message, '❌ You\'re not allowed to run this command. If you believe this is an error, make sure you have the `Administrator` permission.', 'error')
            });
            return;
        }
    }
    if (!(await client.db.table('guilds').get(message.guild.id).run(client.dbConn))) return message.channel.send({
        embed: client.util.embed(message, '❌ No guild database available. Please try again.', 'error')
    });
    let completed;
    let confs = [{
            name: 'Prefix',
            emoji: '❗',
            desc: 'The bot\'s prefix for the server.',
            exec: async (ctx, r) => {
                ctx.edit({
                    embed: client.util.embed(message, '❗ Please send the requested prefix to this channel.')
                });
                let textCollector = ctx.channel.createMessageCollector(m => m.author.id === message.author.id);
                textCollector.on('collect', async res => {
                    client.db.table('guilds').get(message.guild.id).update({
                        prefix: res.content
                    }).run(client.dbConn);
                    res.delete();
                    textCollector.stop();
                    completed = true;
                })
            }
        },
        {
            name: 'Welcome',
            emoji: '👋',
            desc: 'Enable or disable welcome messages and set the channel they will be sent to.',
            exec: async (ctx, r) => {
                let welcomeStatus = (await client.db.table('guilds').get(message.guild.id).run(client.dbConn)).welcomeMessages;

                if (welcomeStatus === false) {
                    ctx.edit({
                        embed: client.util.embed(message, '❗ Please send the ID of the channel you would like me to send welcome messages to. The ID needs to be exact.')
                    })
                    let textCollector = ctx.channel.createMessageCollector(m => m.author.id === message.author.id);
                    textCollector.on('collect', async res => {
                        if (!Number(res.content)) return ctx.edit({embed: client.util.embed(message, '❌ That isn\'t a valid channel ID. Please send the correct channel ID.', 'error')})
                        if (!message.guild.channels.find(col => col.id === res.content)) return ctx.edit({
                            embed: client.util.embed(message, '❌ That isn\'t a valid channel in this server (or my permissions aren\'t high enough to see it). Please send the correct channel ID.', 'error')
                        });
                        client.db.table('guilds').get(message.guild.id).update({
                            welcomeMessages: true,
                            welcomeChannel: res.content
                        }).run(client.dbConn);
                        res.delete();
                        textCollector.stop();
                        completed = true;
                    })
                } else {
                    client.db.table('guilds').get(message.guild.id).update({
                        welcomeMessages: false
                    }).run(client.dbConn);
                    ctx.edit({
                        embed: client.util.embed(message, '✅ Disabled welcome messages.', 'success')
                    });
                    setTimeout(() => {
                        completed = true;
                    }, 1000)
                }
            }
        },
        {
            name: 'Welcome Message',
            emoji: '💬',
            desc: 'Customise the welcome message for this server.',
            exec: async (ctx, r) => {
                ctx.edit({
                    embed: client.util.embed(message, '❗ Please send the message you would like to be sent when someone joins this server, using the appropriate tags (e.g: `{user}` and `{server}`).')
                });

                let textCollector = ctx.channel.createMessageCollector(m => m.author.id === message.author.id);
                textCollector.on('collect', async res => {
                    client.db.table('guilds').get(message.guild.id).update({
                        welcomeMsg: res.content
                    }).run(client.dbConn);
                    res.delete();
                    textCollector.stop();
                    completed = true;
                })
            }
        },
        {
            name: 'Leave',
            emoji: '🚪',
            desc: 'Enable or disable leave messages and the channel they will be sent to.',
            exec: async (ctx, r) => {
                let leaveStatus = (await client.db.table('guilds').get(message.guild.id).run(client.dbConn)).leaveMessages;

                if (leaveStatus === false) {
                    ctx.edit({
                        embed: client.util.embed(message, '❗ Please send the ID of the channel you would like me to send leave messages to. The ID needs to be exact.')
                    })
                    let textCollector = ctx.channel.createMessageCollector(m => m.author.id === message.author.id);
                    textCollector.on('collect', async res => {
                        if (!Number(res.content)) return ctx.edit({embed: client.util.embed(message, '❌ That isn\'t a valid channel ID. Please send the correct channel ID.', 'error')})
                        if (!message.guild.channels.find(col => col.id === res.content)) return ctx.edit({
                            embed: client.util.embed(message, '❌ That isn\'t a valid channel in this server (or my permissions aren\'t high enough to see it). Please send the correct channel ID.', 'error')
                        });
                        client.db.table('guilds').get(message.guild.id).update({
                            leaveMessages: true,
                            leaveChannel: res.content
                        }).run(client.dbConn);
                        res.delete();
                        textCollector.stop();
                        completed = true;
                    })
                } else {
                    client.db.table('guilds').get(message.guild.id).update({
                        leaveMessages: false
                    }).run(client.dbConn);
                    ctx.edit({
                        embed: client.util.embed(message, '✅ Disabled leave messages.', 'success')
                    });
                    setTimeout(() => {
                        completed = true;
                    }, 1000)
                }
            }
        },
        {
            name: 'Leave Message',
            emoji: '📬',
            desc: 'Customise the leave message for this server.',
            exec: async (ctx, r) => {
                ctx.edit({
                    embed: client.util.embed(message, '❗ Please send the message you would like to be sent when someone leaves this server, using the appropriate tags (e.g: `{user}` and `{server}`).')
                });

                let textCollector = ctx.channel.createMessageCollector(m => m.author.id === message.author.id);
                textCollector.on('collect', async res => {
                    client.db.table('guilds').get(message.guild.id).update({
                        leaveMsg: res.content
                    }).run(client.dbConn);
                    res.delete();
                    textCollector.stop();
                    completed = true;
                })
            }
        },
        {
            name: 'Agree',
            emoji: '✅',
            desc: 'Enable or disable the agree command.',
            exec: async (ctx, r) => {
                let agreeStatus = (await client.db.table('guilds').get(message.guild.id).run(client.dbConn)).userVerify;

                if (agreeStatus == false) {
                    ctx.edit({
                        embed: client.util.embed(message, '❗ Please send the name of the role you want me to give to a user when they agree (e.g: Member). The name needs to be exact.')
                    });
                    let textCollector = ctx.channel.createMessageCollector(m => m.author.id === message.author.id);
                    textCollector.on('collect', async res => {
                        if (!message.guild.roles.find(col => col.name === res.content)) return ctx.edit({
                            embed: client.util.embed(message, '❌ That isn\'t a valid role in this server. Please send the correct role name.', 'error')
                        });
                        client.db.table('guilds').get(message.guild.id).update({
                            userVerify: true,
                            verifyRole: res.content
                        }).run(client.dbConn);
                        res.delete();
                        textCollector.stop();
                        completed = true;
                    });
                } else {
                    client.db.table('guilds').get(message.guild.id).update({
                        userVerify: false
                    }).run(client.dbConn);
                    ctx.edit({
                        embed: client.util.embed(message, '✅ Disabled the agree command.', 'success')
                    });
                    setTimeout(() => {
                        completed = true;
                    }, 1000)
                }
            }
        },
        {
            name: 'Logging',
            emoji: '📝',
            desc: 'Enable or disable logging and the logging channel.',
            exec: async (ctx, r) => {
                let logStatus = (await client.db.table('guilds').get(message.guild.id).run(client.dbConn)).logging;

                if (logStatus == false) {
                    ctx.edit({embed: client.util.embed(message, '❗ Please send the ID of the channel you would like me to send logs to. The ID needs to be exact.')});

                    let textCollector = ctx.channel.createMessageCollector(m => m.author.id === message.author.id);
                    textCollector.on('collect', async res => {
                        if (!Number(res.content)) return ctx.edit({embed: client.util.embed(message, '❌ That isn\'t a valid channel ID. Please send the correct channel ID.', 'error')})
                        if (!message.guild.channels.find(col => col.id == res.content)) return ctx.edit({embed: client.util.embed(message, '❌ That isn\'t a valid channel in this server (or my permissions aren\'t high enough to see it). Please send the correct channel name.', 'error')})
                        client.db.table('guilds').get(message.guild.id).update({
                            logging: true,
                            logChannel: res.content
                        }).run(client.dbConn);
                        res.delete();
                        textCollector.stop();
                        completed = true;
                    })
                } else {
                    client.db.table('guilds').get(message.guild.id).update({
                        logging: false
                    }).run(client.dbConn);
                    ctx.edit({embed: client.util.embed(message, '✅ Disabled logging.', 'success')});
                    setTimeout(() => {
                        completed = true;
                    }, 1000)
                }
            }
        },
        {
            name: 'Exit',
            emoji: '❌',
            desc: 'Exit the configure command.',
            exec: async (ctx, r) => {
                ctx.edit({
                    embed: client.util.embed(message, '🕗 Closing...', 'warn')
                });
            }
        }
    ];

    async function run(ctx) {
        let mainFields = [];
        confs.forEach(config => mainFields.push({
            name: `${config.emoji} - ${config.name}`,
            value: config.desc
        }));
        ctx.edit({
            embed: client.util.embed(message, '⚙ Here\'s a list of all the configuration options:', undefined, undefined, undefined, mainFields)
        });
        for (const config of confs) {
            await ctx.react(config.emoji);
        }

        let filter = (reaction, user) => user.id === message.author.id;
        let collector = ctx.createReactionCollector(filter, {});

        collector.on('collect', async r => {
            let x = confs.filter(c => c.emoji === r.emoji.name);
            x.map(e => {
                ctx.reactions.removeAll().catch(err => client.log.error(err));
                if (r.emoji.name === '❌') {
                    collector.stop();
                    ctx.edit({
                        embed: client.util.embed(message, '❌ This configure command has been closed. To continue configuring, run the command again.', 'error')
                    });
                } else {
                    e.exec(ctx, r);
                    setInterval(() => {
                        if (completed === true) {
                            collector.stop();
                            completed = false;
                            run(ctx);
                        }
                    }, 100)
                }
            })
        })
    }

    message.channel.send({
        embed: client.util.embed(message, '🕗 Loading...', 'warn')
    }).then(async ctx => {
        run(ctx);
    })
};

module.exports.info = {
    description: 'Configure the database for your server.',
    usage: 'config',
    maintainer: false,
    aliases: ['setup']
}