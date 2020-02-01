module.exports = async (client, message, args) => {
    let user1 = args[0]
    let user2 = args[1]

    if (!user1 || !user2) return message.channel.send({embed: client.util.embed(message, '❌ You need to mention 2 users!', 'error')});

    if (user1.startsWith('<@') && user1.endsWith('>')) {
        user1 = user1.slice(2, -1);
        if (user1.startsWith('!')) user1 = user1.slice(1);

        user1 = client.users.get(user1);
    }

    if (user2.startsWith('<@') && user2.endsWith('>')) {
        user2 = user2.slice(2, -1);
        if (user2.startsWith('!')) user2 = user2.slice(1);

        user2 = client.users.get(user2);
    }

    if (!user1.username || !user2.username) return message.channel.send({embed: client.util.embed(message, `🥰 *Awh!* ${user1} x ${user2}!`, undefined, undefined, 'https://media.giphy.com/media/VInghBdi0Ym9XJghC0/giphy.gif')});

    message.channel.send({embed: client.util.embed(message, `🥰 *Awh!* ${user1.username} x ${user2.username}!`, undefined, undefined, 'https://media.giphy.com/media/VInghBdi0Ym9XJghC0/giphy.gif')});
}
module.exports.info = {
    description: 'Ship 2 people together.',
    usage: 'ship [@mention] [@mention]',
    maintainer: false
}