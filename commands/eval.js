module.exports = async (client, message, args) => {
    if (!require('../configuration/config.js').maintainers.includes(message.author.id)) return message.channel.send({
        embed: client.util.embed(message, '❌ *Oi!* This is a maintainer only command! Get lost!', 'error')
    });
    code = args.join(' ');
    if (!code) return message.channel.send({
        embed: client.util.embed(message, '❌ You need to give me something to eval!', 'error')
    });
    try {

        function tokenRegex(str) {
            return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
        }

        if (code.includes('token')) return message.channel.send({embed: client.util.embed(message, '❌ Not so fast. You\'re not allowed the token.', 'error')})

        let result = await eval(`(async()=>{${code.includes("return") ? code : "return " + code}})()`);
        if (result) result = require("util").inspect(result).toString().replace(new RegExp(tokenRegex(client.token), 'g'), '<token redacted>');

        if (result.length > 1000) {
            return require('snekfetch').post('https://hasteb.in/documents', {
                data: result
            }).then(res => {
                if (res.body.key) {
                    message.channel.send({
                        embed: client.util.embed(message, `✅ Looks like your eval result was too long! Don\'t worry though; I\'ve got you covered: [Click here](https://hasteb.in/${res.body.key}.js)`)
                    })
                } else {
                    message.channel.send({
                        embed: client.util.embed(message, '❌ Uh oh. I wasn\'t able to post to the Hastebin API. Maybe check its status?', 'error')
                    })
                }
            })
        } 

        message.channel.send({
            embed: client.util.embed(message, `✅ Here's the result: \`\`\`md\n${result}\`\`\``)
        });
    } catch (err) {
        message.channel.send({embed: client.util.embed(message, `❌ Something went wrong while running your code. Here's the details: \`\`\`md\n${err}\`\`\``, 'error')})
    }
}

module.exports.info = {
    description: 'Evaluate code.',
    usage: 'eval [code]',
    maintainer: true
}
