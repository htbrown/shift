module.exports = async (client, message, args) => {
    let time = new Date();
    message.channel.send({embed: client.util.embed(message, '🕗 Pinging...', 'warn')}).then(async ctx => {
        setTimeout(() => {
            ctx.edit({embed: client.util.embed(message, `🏓 Pong! This message took me ${Math.floor(client.ping)}ms to send!`, undefined, `Heartbeat: ${Math.floor(Date.now() - message.createdTimestamp)}ms`)})
        }, Math.floor(client.ping));
    })
};

module.exports.info = {
    description: 'Ping the bot.',
    usage: 'ping',
    maintainer: false
};