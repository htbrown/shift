module.exports = async (client, message, args) => {
    if (!message.mentions.members.first()) {
        message.channel.send({embed: client.util.embed(message, '🖼 Here\'s your avatar:', undefined, undefined, message.author.displayAvatarURL)});
    } else {
        message.channel.send({embed: client.util.embed(message, `🖼 Here\'s ${message.mentions.members.first().user.username}'s avatar:`, undefined, undefined, message.mentions.members.first().user.displayAvatarURL)});
    }
};

module.exports.info = {
    description: 'Grab someone\'s avatar.',
    usage: 'avatar (@mention)',
    maintainer: false
}