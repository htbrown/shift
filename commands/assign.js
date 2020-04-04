module.exports = async (client, message, args) => {
    let role = args.join(' ');
    let assignableRoles = (await client.db.table('guilds').get(message.guild.id).run(client.dbConn)).assignableRoles;

    if (!role) {
        if (assignableRoles.length === 0) return message.channel.send({embed: client.util.embed(message, '❌ This guild doesn\'t have any assignable roles!', 'error')});

        let roles = '📕 Here\'s a list of assignable roles: \n\n';
        assignableRoles.forEach(r => {
            roles = roles + `- ${r}\n`
        });
        message.channel.send({embed: client.util.embed(message, roles)});
    } else {
        if (!message.guild.roles.some(r => r.name === role)) return message.channel.send({embed: client.util.embed(message, '❌ You need to give me a valid role!', 'error')});
        if (!assignableRoles.includes(role)) return message.channel.send({embed: client.util.embed(message, '❌ That role isn\'t an assignable role!', 'error')});

        if (!message.member.roles.some(r => r.name === role)) {
            message.member.roles.add(message.guild.roles.find(r => r.name === role)).then(() => {
                message.channel.send({embed: client.util.embed(message, `✅ I have given you the \`${role}\` role.`, 'success')});
            }).catch(err => message.channel.send({embed: client.util.embed(message, `❌ Oops! Looks like something went wrong. Here's the details:\n \`\`\`${err}\`\`\``, 'error')}));
        } else {
            message.member.roles.remove(message.guild.roles.find(r => r.name === role)).then(() => {
                message.channel.send({embed: client.util.embed(message, `✅ I have taken the \`${role}\` role from you.`, 'success')});
            }).catch(err => message.channel.send({embed: client.util.embed(message, `❌ Oops! Looks like something went wrong. Here's the details:\n \`\`\`${err}\`\`\``, 'error')}));
        }
    }
};

module.exports.info = {
    description: 'Assigns/removes an assignable role to a user or shows a list of assignable roles.',
    usage: 'assign (role)',
    maintainer: false,
    aliases: ['role', 'assignrole']
};