const cryptoRandomString = require('crypto-random-string');
module.exports = async (client, message, args) => {
    let strikeUser = message.mentions.members.first();
    let user = client.users.get(strikeUser.id);
    let reason = args.slice(1).join(" ");
    let strikeId = cryptoRandomString({
        length: 5
    });

    if (!message.member.hasPermission('KICK_MEMBERS')) return message.channel.send({
        embed: client.util.embed(message, '❌ You\'re not allowed to run this command. If you believe this is an error, make sure you have the `Kick Members` permission.', 'error')
    });
    if (!strikeUser) return message.channel.send({
        embed: client.util.embed(message, '❌ You need to mention a user!', 'error')
    });
    if (!reason) reason = 'No reason specified';

    client.db.table('strikes').insert({
        id: strikeId,
        userID: strikeUser.user.id,
        guildID: message.guild.id,
        reason: reason,
        punisher: message.author.tag
    }).run(client.dbConn, (err, cursor) => {
        if (err) {
            message.channel.send({
                embed: client.util.embed(message, '❌ Uh oh. Something seems to have gone wrong with the database. Is it down?', 'error')
            });
            client.log.error(`Something has gone wrong whilst running the strike command. Here's the details: \n${err.stack}`);
            return;
        }
    });

    message.channel.send({
        embed: client.util.embed(message, `✅ I have stricken ${strikeUser.user.username} for \`${reason}\`.`, 'success')
    });
    strikeUser.send({
        embed: client.util.embed(user, `😮 Uh oh, looks like you've been stricken in ${message.guild.name} for \`${reason}\`.`)
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
                description: `${strikeUser.user.tag} has been stricken by ${message.author.tag}.`,
                fields: [{
                        name: '🆔 ID',
                        value: strikeId,
                        inline: true
                    },
                    {
                        name: '❓ Reason',
                        value: reason,
                        inline: true
                    },
                    {
                        name: '❗ Punisher',
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
    description: 'Strike a user.',
    usage: 'strike [@mention] (reason)',
    maintainer: false
}