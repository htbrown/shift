module.exports = async (client, message, args) => {
    let member = message.mentions.members.first();
    let awards;

    if (member) {
        client.db.table('awards').filter({
            guildID: message.guild.id,
            userID: member.user.id
        }).run(client.dbConn, (err, cursor) => {
            if (err) {
                message.channel.send({
                    embed: client.util.embed(message, '❌ Uh oh. Something seems to have gone wrong with the database. Is it down?', 'error')
                });
                client.log.error(`Something has gone wrong whilst running the awards command. Here's the details: \n${err.stack}`);
                return;
            } else {
                cursor.toArray((err, results) => {
                    if (err) return client.log.error(err);

                    let fields = [];

                    if (results.length <= 0) return message.channel.send({
                        embed: client.util.embed(message, `🤔 Looks like ${member.user.username} hasn't got any awards.`)
                    })

                    results.forEach(s => {
                        fields.push({
                            name: s.reason,
                            value: `${s.id} | from ${s.awarder}`
                        })
                    })
                    message.channel.send({
                        embed: client.util.embed(message, `📖 Here's the awards I found for ${member.user.username}:`, undefined, undefined, undefined, fields)
                    })
                })
            }
        });
    } else {
        client.db.table('awards').filter({
            guildID: message.guild.id,
            userID: message.author.id
        }).run(client.dbConn, (err, cursor) => {
            if (err) {
                message.channel.send({
                    embed: client.util.embed(message, '❌ Uh oh. Something seems to have gone wrong with the database. Is it down?', 'error')
                });
                client.log.error(`Something has gone wrong whilst running the awards command. Here's the details: \n${err.stack}`);
                return;
            } else {
                cursor.toArray((err, results) => {
                    if (err) return client.log.error(err);

                    let fields = [];

                    if (results.length <= 0) return message.channel.send({
                        embed: client.util.embed(message, `🤔 Looks like ${message.author.username} hasn't got any awards.`)
                    })

                    results.forEach(s => {
                        fields.push({
                            name: s.reason,
                            value: `${s.id} | from ${s.awarder}`
                        })
                    })
                    message.channel.send({
                        embed: client.util.embed(message, `📖 Here's the awards I found for ${message.author.username}:`, undefined, undefined, undefined, fields)
                    })
                })
            }
        });
    }
};

module.exports.info = {
    description: 'See someone\'s awards.',
    usage: 'awards (@mention)',
    maintainer: false
}