module.exports = async (client, message, args) => {
    if (!message.mentions.members.first()) {
        message.channel.send({embed: client.util.embed(message, '🖼 Here\'s your avatar:', undefined, undefined, {url: message.author.displayAvatarURL({size: 2048})})});
    } else {
        message.channel.send({embed: client.util.embed(message, `🖼 Here\'s ${message.mentions.members.first().user.username}'s avatar:`, undefined, undefined, {url: message.mentions.members.first().user.displayAvatarURL({size: 2048})})});
    }
};

module.exports.info = {
    description: 'Grab someone\'s avatar.',
    usage: 'avatar (@mention)',
    maintainer: false,
    aliases: ['pfp']
}