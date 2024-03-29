module.exports = async (client, message, args) => {
    let fields = [
        {
            name: '🏠 Servers',
            value: client.guilds.cache.size,
            inline: true
        },
        {
            name: '👥 Members',
            value: client.users.cache.size,
            inline: true
        },
        {
            name: '🏓 Ping',
            value: `${Math.floor(client.ws.ping)}ms`,
            inline: true
        },
        {
            name: '💗 Version',
            value: `v${require('../package.json').version}`,
            inline: true
        },
        {
            name: '🤖 Discord.js Version',
            value: `v${require('discord.js').version}`,
            inline: true
        },
        {
            name: '👓 Node.js Version',
            value: process.version,
            inline: true
        }
    ];
    message.channel.send({embed: client.util.embed(message, 'Here\'s some statistics:', undefined, undefined, undefined, fields, client.user.avatarURL())})
}

module.exports.info = {
    description: 'Get bot statistics.',
    usage: 'stats',
    maintainer: false,
    aliases: ['statistics']
}