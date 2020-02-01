module.exports = async (client, message, args) => {
    if (
      !require("../configuration/config.js").maintainers.includes(
        message.author.id
      )
    )
      return message.channel.send({
        embed: client.util.embed(
          message,
          "❌ *Oi!* This is a maintainer only command! Get lost!",
          "error"
        )
      });
    if (message.mentions.members.first()) args[0] = args[0].replace("<@", "").replace("!", "").replace(">", "")
    if (!args[0])
      return message.channel.send({
        embed: client.util.embed(
          message,
          "❌ You need to give me a user to whitelist!",
          "error"
        )
      });
  
    let isBlacklisted = (
      await client.db
      .table("users")
      .get(args[0])
      .run(client.dbConn)
    ).blacklist;
  
    if (isBlacklisted != true)
      return message.channel.send({
        embed: client.util.embed(
          message,
          "❌ That user isn't blacklisted!",
          "error"
        )
      });
  
    client.db.table('users').get(args[0]).update({blacklist: false}).run(client.dbConn);
    message.channel.send({
      embed: client.util.embed(message, `✅ I have whitelisted ${client.users.get(args[0]).username}.`, 'success')
    })
  };
  
  module.exports.info = {
    description: "whitelist a user from using the bot.",
    usage: "whitelist [id]",
    maintainer: true
  };