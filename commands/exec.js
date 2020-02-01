const cProcess = require('child_process');
module.exports = async (client, message, args) => {
    let cmd = args.join(' ');
    if (!require('../configuration/config.js').maintainers.includes(message.author.id)) return message.channel.send({
        embed: client.util.embed(message, '❌ *Oi!* This is a maintainer only command! Get lost!', 'error')
    });
    if (!cmd) return message.channel.send({
        embed: client.util.embed(message, '❌ You need to give me something to execute!', 'error')
    });
    cProcess.exec(cmd, (err, stdout, stderr) => {
        if (err) {
            return message.channel.send({
                embed: client.util.embed(message, `❌ Something went wrong while running your command. Here's the details: \`\`\`md\n${err}\`\`\``, 'error')
            })
        } else {
            message.channel.send({embed: client.util.embed(message, `✅ Here's the result: \`\`\`md\n${stdout}\`\`\``)})
        }
    })
};

module.exports.info = {
    description: 'Run a shell/bash command.',
    usage: 'exec [command]',
    maintainer: true
}