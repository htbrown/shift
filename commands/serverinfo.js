module.exports = async (client, message, args) => {
    let verLev;
    switch (message.guild.verificationLevel) {
        case 'NONE':
            verLev = 'None';
            break;
        case 'LOW':
            verLev = 'Verified email (low)';
            break;
        case 'MEDIUM':
            verLev = 'Registered for 5+ mins (medium)'
            break;
        case 'HIGH':
            verLev = 'Member for 10+ mins (high)'
            break;
        case 'VERY_HIGH':
            verLev = 'Verified phone number (very high)'
            break;
    }

    let iconUrl;
    if (!message.guild.iconURL) {
        iconUrl = client.user.avatarURL();
    } else {
        iconUrl = message.guild.iconURL().replace('jpg', 'png');
    }

    let date = new Date(message.guild.createdTimestamp);

    let createdAt = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`

    let fields = [
        {
            name: '🆔 ID',
            value: message.guild.id,
            inline: true,
        },
        {
            name: '👥 Members',
            value: message.guild.memberCount,
            inline: true
        },
        {
            name: '✅ Verification Level',
            value: verLev,
            inline: true
        },
        {
            name: '💥 Creation',
            value: createdAt,
            inline: true
        },
        {
            name: '💼 Owner',
            value: message.guild.owner.user.tag,
            inline: true
        },
        {
            name: '#️⃣ Channels',
            value: message.guild.channels.cache.size,
            inline: true
        }
    ];

    message.channel.send({embed: client.util.embed(message, `Here's what I found for ${message.guild.name}.`, undefined, undefined, undefined, fields, iconUrl)});
};

module.exports.info = {
    description: 'Shows information about the current server.',
    usage: 'serverinfo',
    maintainer: false,
    aliases: ['server']
}