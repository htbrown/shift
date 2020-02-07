const cryptoRandomString = require('crypto-random-string');
module.exports = async (client, message, args) => {
    let awardUser = message.mentions.members.first();
    let user = client.users.get(awardUser.id);
    let reason = args.slice(1).join(" ");
    let awardId = cryptoRandomString({length: 5});

    if (!message.member.hasPermission('KICK_MEMBERS')) return message.channel.send({embed: client.util.embed(message, '❌ You\'re not allowed to run this command. If you believe this is an error, make sure you have the `Kick Members` permission.', 'error')});
    if (!awardUser) return message.channel.send({embed: client.util.embed(message, '❌ You need to mention a user!', 'error')});
    if (!reason) reason = 'No reason specified'

    client.db.table('awards').insert({
        id: awardId,
        userID: awardUser.user.id,
        guildID: message.guild.id,
        reason: reason,
        awarder: message.author.tag
    }).run(client.dbConn, (err, cursor) => {
        if (err) {
            message.channel.send({embed: client.util.embed(message, '❌ Uh oh. Something seems to have gone wrong with the database. Is it down?', 'error')});
            client.log.error(`Something has gone wrong whilst running the award command. Here's the details: \n${err.stack}`);
            return;
        }
    });

    message.channel.send({embed: client.util.embed(message, `✅ I have given ${awardUser.user.username} an award for \`${reason}\`.`, 'success')});
    awardUser.send({embed: client.util.embed(user, `😄 Congrats! You've just been given an award in ${message.guild.name} for \`${reason}\`.`)})

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
                description: `${awardUser.user.tag} has been given an award by ${message.author.tag}.`,
                fields: [{
                        name: '🆔 ID',
                        value: awardId,
                        inline: true
                    },
                    {
                        name: '❓ Reason',
                        value: reason,
                        inline: true
                    },
                    {
                        name: '❗ Awarder',
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
    description: 'Award a user.',
    usage: 'award [@mention] (reason)',
    maintainer: false
}