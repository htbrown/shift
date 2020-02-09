module.exports = async (client, message, args) => {
  message.channel.send({
    embed: client.util.embed(
      message,
      `🥰 You want my invite? Sure, [click here to invite me.](https://discordapp.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot)`
    )
  });
};

module.exports.info = {
  description: "Sends an invite for the bot.",
  usage: "invite",
  maintainer: false,
  aliases: []
};
