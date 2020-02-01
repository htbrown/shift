module.exports = async (client, message, args) => {
    let banUser = message.mentions.members.first();
    let reason = args.slice(1).join(' ');

    if (!reason) reason = 'No reason specified';
    if (!message.member.hasPermission('BAN_MEMBERS')) return message.channel.send({embed: client.util.embed(message, '❌ You\'re not allowed to run this command. If you believe this is an error, make sure you have the `Ban Members` permission.', 'error')});
    if (!banUser) return message.channel.send({embed: client.util.embed(message, '❌ You need to mention a user!')});
    if (!banUser.bannable) return message.channel.send({embed: client.util.embed(message, '❌ This user cannot be banned because I do not have the appropriate permissions to do so. If this is an error, make sure I have the right permissions, and am higher than the user you are trying to ban.', 'error')})

    message.channel.send({embed: client.util.embed(message, '🕗 Please wait...', 'warn')}).then(async ctx => {
        banUser.send({embed: client.util.embed(message, `😔 Uh oh, looks like you've been banned from ${message.guild.name} for ${reason}.`)}).then(() => {
            message.guild.ban(banUser.id);
            ctx.edit({embed: client.util.embed(message, `✅ I have banned ${banUser.user.username} for ${reason}.`, 'success')});
        })
    });
};

module.exports.info = {
    description: 'Ban a user from the current server.',
    usage: 'ban [@mention] (reason)',
    maintainer: false
}