module.exports = async (client, message, args) => {
    if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send({embed: client.util.embed(message, '❌ You\'re not allowed to run this command. If you believe this is an error, make sure you have the `Manage Messages` permission.', 'error')});
    args[0] = parseInt(args[0]);
    if (!args[0]) return message.channel.send({embed: client.util.embed(message, '❌ You need to give an amount!', 'error')})
    if (args[0] > 100) return message.channel.send({embed: client.util.embed(message, '❌ You can\'t delete more than 100 messages at a time.', 'error')})
    var user = message.mentions.members.first();
    message.delete();
    message.channel.messages.fetch({
        limit: 100
    }).then(messages => {
        if (user) {
            let filterBy = user ? user.id : client.user.id;

            messages = messages.filter(m => m.author.id == filterBy).array().slice(0, args[0]);
        } else {
            messages = messages.array().slice(0, args[0])
        }
        message.channel.bulkDelete(messages).then(() => {
            if (user) {
                message.channel.send({embed: client.util.embed(message, `✅ I have deleted ${args[0]} messages from ${user.user.username}.`, 'success')})
            } else {
                message.channel.send({embed: client.util.embed(message, `✅ I have deleted ${args[0]} messages.`)})
            }
        }).catch(err => {
            client.log.error(`An error occured while purging messages in ${message.guild.name}. Here's the details: \n${err.stack}`)
            message.channel.send({embed: client.util.embed(message, '❌ Something went wrong while deleting those messages. Messages over 14 days old can\'t be deleted.', 'error')})
            return;
        });
    })
};

module.exports.info = {
    description: 'Purge messages from a channel, either generally, or from a specified user.',
    usage: 'purge [amount] (@mention)',
    maintainer: false
}