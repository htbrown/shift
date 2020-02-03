module.exports = async (client, message, args) => {
    if (!message.member.hasPermission('KICK_MEMBERS')) return message.channel.send({
        embed: client.util.embed(message, '❌ You\'re not allowed to run this command. If you believe this is an error, make sure you have the `Kick Members` permission.', 'error')
    });
    if (!args) return message.channel.send({
        embed: client.util.embed(message, '❌ You need to include at least one award ID!', 'error')
    });
    if (message.mentions.members.first()) return message.channel.send({
        embed: client.util.embed(message, '❌ You now no longer need to mention the user you\'re removing the award from.', 'error')
    })

    let completed;

    args.forEach(async id => {
        client.db.table('awards').get(id).delete().run(client.dbConn, (err, cursor) => {
            if (err) {
                message.channel.send({
                    embed: client.util.embed(message, '❌ That doesn\'t seem to be a valid award ID.', 'error')
                });
                client.log.error(`Something has gone wrong whilst running the awards command. Here's the details: \n${err.stack}`);
                return;
            } else {
                client.log.info(`The award with the ID "${id}" has been deleted.`)
            }
        })
    });
    message.channel.send({
        embed: client.util.embed(message, `✅ The award(s) \`${args.join(', ')}\` have been deleted.`, 'success')
    })

    // Logging

    let logStatus = (await client.db.table('guilds').get(message.guild.id).run(client.dbConn)).logging;
    if (logStatus != false) {
        let channel = (await client.db.table('guilds').get(message.guild.id).run(client.dbConn)).logChannel;

        message.guild.channels.find(c => c.id == channel).send({
            embed: {
                author: {
                    name: client.user.username,
                    icon_url: client.user.avatarURL()
                },
                description: `${message.author.tag} has removed one or more awards.`,
                fields: [{
                        name: '🆔 IDs',
                        value: `\`${args.join(', ')}\``,
                        inline: true
                    },
                    {
                        name: '❗ Remover',
                        value: message.author.tag,
                        inline: true
                    }
                ],
                color: 0x36393F,
                timestamp: new Date(),
                footer: {
                    text: `v${require('../package.json').version}`
                }
            }
        })
    }
}
module.exports.info = {
    description: 'Remove one or more awards from a user.',
    usage: 'rmawards [id] (id) (id)...',
    maintainer: false
}