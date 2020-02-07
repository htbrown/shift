module.exports = async (client, message, args) => {
    let u = message.mentions.members.first();

    if (args[1] == 'positive') {
        if (!u) return message.channel.send({embed: client.util.embed(message, '❌ You need to mention a user!', 'error')});
        if (u.user.id == message.author.id) return message.channel.send({embed: client.util.embed(message, '❌ You can\'t change your own points!', 'error')})
        let repPoints = (await client.db.table('users').get(u.user.id).run(client.dbConn)).repPoints;
        if (!repPoints) return message.channel.send({embed: client.util.embed(message, '❌ No reputation score available!', 'error')})

        if (repPoints >= 100) return message.channel.send({embed: client.util.embed(message, '😇 This user is already at the maximum reputation you can get (100). Good for them!')});

        client.db.table('users').get(u.user.id).update({repPoints: repPoints + 5}).run(client.dbConn);
        message.channel.send({embed: client.util.embed(message, `✅ I have added 5 reputation points to ${u.user.username}.`, 'success')});
    } else if (args[1] == 'negative') {
        if (!u) return message.channel.send({embed: client.util.embed(message, '❌ You need to mention a user!', 'error')});
        if (u.user.id == message.author.id) return message.channel.send({embed: client.util.embed(message, '❌ You can\'t change your own points!', 'error')})
        let repPoints = (await client.db.table('users').get(u.user.id).run(client.dbConn)).repPoints;
        if (!repPoints) return message.channel.send({embed: client.util.embed(message, '❌ No reputation score available!', 'error')})

        if (repPoints <= 0) return message.channel.send({embed: client.util.embed(message, '😐 Hmm... This user is on the lowest reputation they can get (0). Might want to get them to fix that...')});

        client.db.table('users').get(u.user.id).update({repPoints: repPoints - 5}).run(client.dbConn);
        message.channel.send({embed: client.util.embed(message, `✅ I have taken 5 reputation points from ${u.user.username}.`, 'success')});
    } else {
        if (!u) {
            let repPoints = (await client.db.table('users').get(message.author.id).run(client.dbConn)).repPoints;
            if (!repPoints) repPoints = 'Not available.';

            message.channel.send({embed: client.util.embed(message, `😀 You have a reputation score of ${repPoints}!`)});
        } else {
            let repPoints = (await client.db.table('users').get(u.user.id).run(client.dbConn)).repPoints;
            if (!repPoints) repPoints = 'Not available.';

            message.channel.send({embed: client.util.embed(message, `😀 ${u.user.username} has a reputation score of ${repPoints}!`)});
        }

    }

}

module.exports.info = {
    description: 'Manage a users reputation points.',
    usage: 'rep [@mention] (positive/negative)',
    maintainer: false
}