module.exports = async (client, message, args) => {
  if (!message.mentions.members.first()) {
    let gayNumber = Math.floor(Math.random() * 100);
    let emoji;

    if (gayNumber <= 10) {
      emoji = "📏";
    } else if (gayNumber < 50 && gayNumber > 10) {
      emoji = "🤔";
    } else if (gayNumber >= 50 && gayNumber < 90) {
      emoji = "😮";
    } else if (gayNumber >= 90) {
      emoji = "🏳‍🌈";
    }

    message.channel.send({
      embed: client.util.embed(message, `${emoji} You are ${gayNumber}% gay!`)
    });
  } else {
    let gayNumber = Math.floor(Math.random() * 100);
    let emoji;

    if (gayNumber <= 10) {
      emoji = "📏";
    } else if (gayNumber < 50 && gayNumber > 10) {
      emoji = "🤔";
    } else if (gayNumber >= 50 && gayNumber < 90) {
      emoji = "😮";
    } else if (gayNumber >= 90) {
      emoji = ":gay_pride_flag:"; // 🏳‍🌈
    }

    message.channel.send({
      embed: client.util.embed(
        message,
        `${emoji} ${
          message.mentions.members.first().user.username
        } is ${gayNumber}% gay!`
      )
    });
  }
};

module.exports.info = {
  description: "Find out how gay someone is.",
  usage: "gay (@mention)",
  maintainer: false
};
