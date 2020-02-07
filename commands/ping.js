module.exports = async (client, message, args) => {
    let time = new Date();
    message.channel.send({embed: client.util.embed(message, '🕗 Pinging...', 'warn')}).then(async ctx => {
            ctx.edit({embed: client.util.embed(message, `🏓 Pong! This message took me ${Math.floor(ctx.createdTimestamp - message.createdTimestamp)}ms to send!`, undefined, `Heartbeat: ${Math.floor(client.ws.ping)}ms`)})
    })
};

module.exports.info = {
    description: 'Ping the bot.',
    usage: 'ping',
    maintainer: false
};