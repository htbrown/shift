module.exports = async (client, message, args) => {
    let role = args.join(' ');

    if (!message.member.hasPermission('MANAGE_ROLES')) return message.channel.send({embed: client.util.embed(message, '❌ You\'re not allowed to run this command. If you believe this is an error, make sure you have the `Manage Roles` permission.', 'error')});
    if (!role) return message.channel.send({embed: client.util.embed(message, '❌ You need to give me a valid role!', 'error')});
    if (!message.guild.roles.cache.some(r => r.name === role)) return message.channel.send({embed: client.util.embed(message, '❌ You need to give me a valid role!', 'error')});

    let assignableRoles = (await client.db.table('guilds').get(message.guild.id).run(client.dbConn)).assignableRoles;

    if (assignableRoles.includes(role)) return message.channel.send({embed: client.util.embed(message, '❌ A role with the same name as this is already assignable!', 'error')});

    assignableRoles.push(role);

    client.db.table('guilds').get(message.guild.id).update({ assignableRoles: assignableRoles }).run(client.dbConn);

    message.channel.send({embed: client.util.embed(message, `✅ I have added an assignable role with the name \`${role}\`.`, 'success')})
};

module.exports.info = {
  description: 'Add an assignable role for the server you execute it in.',
  usage: 'addrole [role]',
  maintainer: false,
  aliases: []
};