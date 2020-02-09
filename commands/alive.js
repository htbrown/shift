module.exports = async (client, message, args) => {
    if (!message.mentions.members.first()) {
        let aliveNumber = Math.floor(Math.random() * 100);
        let emoji;
    
        if (aliveNumber <= 10) {
            emoji = '😵';
        } else if (aliveNumber < 50 && aliveNumber > 10) {
            emoji = '😷';
        } else if (aliveNumber >= 50 && aliveNumber < 90) {
            emoji = '😮';
        } else if (aliveNumber >= 90) {
            emoji = '😃';
        };
    
        message.channel.send({embed: client.util.embed(message, `${emoji} You are ${aliveNumber}% alive!`)})
    } else {
        let aliveNumber = Math.floor(Math.random() * 100);
        let emoji;
    
        if (aliveNumber <= 10) {
            emoji = '😵';
        } else if (aliveNumber < 50 && aliveNumber > 10) {
            emoji = '😷';
        } else if (aliveNumber >= 50 && aliveNumber < 90) {
            emoji = '😮';
        } else if (aliveNumber >= 90) {
            emoji = '😃';
        };
    
        message.channel.send({embed: client.util.embed(message, `${emoji} ${message.mentions.members.first().user.username} is ${aliveNumber}% alive!`)})
    }
};

module.exports.info = {
    description: 'Find out how alive someone is.',
    usage: 'alive (@mention)',
    maintainer: false,
    aliases: []
}