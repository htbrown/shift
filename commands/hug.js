module.exports = async (client, message, args) => {
    let res = await (await require('node-fetch')('https://rra.ram.moe/i/r?type=hug')).json();

    if (!message.mentions.members.first()) return message.channel.send({embed: client.util.embed(message, '😢 You must be really lonely. Here\'s a hug from me.', undefined, undefined, {url: `https://rra.ram.moe${res.path}`})});

    message.channel.send({embed: client.util.embed(message, `🤗 *Awhh!* ${message.author.username} just hugged ${message.mentions.members.first().user.username}!`, undefined, undefined, {url: `https://rra.ram.moe${res.path}`})})
}
module.exports.info = {
    description: 'Hug someone.',
    usage: 'hug (@mention)',
    maintainer: false,
    aliases: []
}