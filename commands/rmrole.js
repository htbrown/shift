module.exports = async (client, message, args) => {
    let role = args.join(' ');

    if (!message.member.hasPermission('MANAGE_ROLES')) return message.channel.send({embed: client.util.embed(message, '❌ You\'re not allowed to run this command. If you believe this is an error, make sure you have the `Manage Roles` permission.', 'error')});
    if (!role) return message.channel.send({embed: client.util.embed(message, '❌ You need to give me a valid role!', 'error')});
    if (!message.guild.roles.cache.some(r => r.name === role)) return message.channel.send({embed: client.util.embed(message, '❌ You need to give me a valid role!', 'error')});

    let assignableRoles = (await client.db.table('guilds').get(message.guild.id).run(client.dbConn)).assignableRoles;

    if (!assignableRoles.includes(role)) return message.channel.send({embed: client.util.embed(message, '❌ That role isn\'t an assignable role!', 'error')});

    let index = assignableRoles.indexOf(role);
    if (index > -1) {
        assignableRoles.splice(index, 1);
    }

    client.db.table('guilds').get(message.guild.id).update({ assignableRoles: assignableRoles }).run(client.dbConn);

    message.channel.send({embed: client.util.embed(message, `✅ I have removed an assignable role with the name \`${role}\`.`, 'success')})
};

module.exports.info = {
    description: 'Remove an assignable role from the server you execute it in.',
    usage: 'rmrole [role]',
    maintainer: false,
    aliases: []
};