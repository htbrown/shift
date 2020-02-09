module.exports = async (client, message, args) => {
    let member = message.mentions.members.first();
    if (member) {
        let rep = (await client.db.table('users').get(member.user.id).run(client.dbConn)).repPoints;

        if (!rep) rep = 'Not available.';

        let createdDate = new Date(member.user.createdTimestamp);
        let createdAt = `${createdDate.getDate()}/${createdDate.getMonth() + 1}/${createdDate.getFullYear()}`;

        let joinedDate = new Date(member.joinedTimestamp);
        let joinedAt = `${joinedDate.getDate()}/${joinedDate.getMonth() + 1}/${joinedDate.getFullYear()}`;

        let fields = [
            {
                name: '👤 Tag',
                value: member.user.tag,
                inline: true
            },
            {
                name: '🆔 ID',
                value: member.user.id,
                inline: true
            },
            {
                name: '😀 Joined Discord',
                value: createdAt,
                inline: true
            },
            {
                name: '🏠 Joined Server',
                value: joinedAt,
                inline: true
            },
            {
                name: '👍 Reputation Score',
                value: rep,
                inline: true
            },
            {
                name: '🔼 Highest Role',
                value: member.roles.highest.name,
                inline: true
            },
            {
                name: '🖼 Status',
                value: member.presence.status,
                inline: true
            }
        ];

        message.channel.send({embed: client.util.embed(message, `Here's what I found for ${member.user.username}:`, undefined, undefined, undefined, fields, member.user.avatarURL)})
    } else {
        let rep = (await client.db.table('users').get(message.author.id).run(client.dbConn)).repPoints;

        let createdDate = new Date(message.author.createdTimestamp);
        let createdAt = `${createdDate.getDate()}/${createdDate.getMonth() + 1}/${createdDate.getFullYear()}`;

        let joinedDate = new Date(message.member.joinedTimestamp);
        let joinedAt = `${joinedDate.getDate()}/${joinedDate.getMonth() + 1}/${joinedDate.getFullYear()}`;

        let fields = [
            {
                name: '👤 Tag',
                value: message.author.tag,
                inline: true
            },
            {
                name: '🆔 ID',
                value: message.author.id,
                inline: true
            },
            {
                name: '😀 Joined Discord',
                value: createdAt,
                inline: true
            },
            {
                name: '🏠 Joined Server',
                value: joinedAt,
                inline: true
            },
            {
                name: '👍 Reputation Score',
                value: rep,
                inline: true
            },
            {
                name: '🔼 Highest Role',
                value: message.member.roles.highest.name,
                inline: true
            },
            {
                name: '🖼 Status',
                value: message.member.presence.status,
                inline: true
            }
        ];

        message.channel.send({embed: client.util.embed(message, `Here's what I found for ${message.author.username}:`, undefined, undefined, undefined, fields, message.author.avatarURL)})

    }
}

module.exports.info = {
    description: 'Get information about a user.',
    usage: 'profile (@mention)',
    maintainer: false,
    aliases: []
}