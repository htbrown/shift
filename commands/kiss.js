module.exports = async (client, message, args) => {
    let res = await (await require('node-fetch')('https://rra.ram.moe/i/r?type=kiss')).json();

    if (!message.mentions.members.first()) return message.channel.send({embed: client.util.embed(message, '❌ You can\'t kiss yourself!', 'error')});

    message.channel.send({embed: client.util.embed(message, `💛 *Awhh!* ${message.author.username} just kissed ${message.mentions.members.first().user.username}!`, undefined, undefined, {url: `https://rra.ram.moe${res.path}`})})
}
module.exports.info = {
    description: 'Kiss someone.',
    usage: 'kiss (@mention)',
    maintainer: false
}