module.exports = async (client, message, args) => {
    let agreeStatus = (await client.db.table('guilds').get(message.guild.id).run(client.dbConn)).userVerify;
    if (agreeStatus != false) {
        let agreeRole = (await client.db.table('guilds').get(message.guild.id).run(client.dbConn)).verifyRole;
        let member = message.guild.member(message.author.id);

        member.roles.add(message.guild.roles.cache.find(r => r.name == agreeRole))
            .then(() => {
                message.delete();
                message.author.send({embed: client.util.embed(message, `✅ I have given you the ${agreeRole} role in ${message.guild.name}.`, 'success')})
            })
            .catch(err => message.channel.send({embed: client.util.embed(message, `❌ Oops! Looks like something went wrong. Here's the details:\n \`\`\`${err}\`\`\``, 'error')}));
    } else {
        message.channel.send({embed: client.util.embed(message, '❌ Agree is not setup in this server. To set it up, use the config command.', 'error')})
    }
}

module.exports.info = {
    description: 'Gives a new member the verification role set for the server.',
    usage: 'agree',
    maintainer: false,
    aliases: []
}