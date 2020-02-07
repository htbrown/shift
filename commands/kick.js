module.exports = async (client, message, args) => {
    let kickUser = message.mentions.members.first();
    let user = client.users.get(kickUser.id);
    let reason = args.slice(1).join(' ');

    if (!reason) reason = 'No reason specified';
    if (!message.member.hasPermission('KICK_MEMBERS')) return message.channel.send({embed: client.util.embed(message, '❌ You\'re not allowed to run this command. If you believe this is an error, make sure you have the `Kick Members` permission.', 'error')});
    if (!kickUser) return message.channel.send({embed: client.util.embed(message, '❌ You need to mention a user!')});
    if (!kickUser.kickable) return message.channel.send({embed: client.util.embed(message, '❌ This user cannot be kicked because I do not have the appropriate permissions to do so. If this is an error, make sure I have the right permissions, and am higher than the user you are trying to kick.', 'error')})

    message.channel.send({embed: client.util.embed(message, '🕗 Please wait...', 'warn')}).then(async ctx => {
        kickUser.send({embed: client.util.embed(user, `😔 Uh oh, looks like you've been kicked from ${message.guild.name} for \`${reason}\`.`)}).then(() => {
            message.guild.members.find(m => m.id === kickUser.id).kick();
            ctx.edit({embed: client.util.embed(message, `✅ I have kicked ${kickUser.user.username} for \`${reason}\`.`, 'success')});
        }).catch(() => {
            ctx.edit({
                embed: client.util.embed(message, `✅ I couldn't send a DM to ${kickUser.user.username}, but I kicked them for \`${reason}\` anyway.`, 'success')
            }).then(() => {
                message.guild.members.find(m => m.id === kickUser.id).kick();
            })
        })
    });
};

module.exports.info = {
    description: 'Kick a user from the current server.',
    usage: 'kick [@mention] (reason)',
    maintainer: false
}