module.exports = async (client, message, args) => {
    if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send({embed: client.util.embed(message, '❌ You\'re not allowed to run this command. If you believe this is an error, make sure you have the `Manage Messages` permission.', 'error')});
    if (!args) return message.channel.send({embed: client.util.embed(message, '❌ You need to add a message!')})
    message.channel.send({embed: {
        color: 0x36393F,
        author: {
            name: message.author.username,
            icon_url: message.author.displayAvatarURL
        },
        description: args.join(" "),
        footer: {
            text: `v${require('../package.json').version}`
        }
    }});
}

module.exports.info = {
    description: 'Embed a message.',
    usage: 'embed [message]',
    maintainer: false
}