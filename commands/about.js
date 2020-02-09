module.exports = async (client, message, args) => {
    message.channel.send({embed: client.util.embed(message, `🤖 Shift v${require('../package.json').version} by the Shift Team \([Prmpt Team](https://prmpt.xyz/members)\). Created using Node.js and various other NPM packages.`, undefined, undefined, undefined, [{name: '🔗 Links', value: '[Shift](https://shiftbot.xyz)\n[Prmpt Group](https://prmpt.xyz)\n[Shift Support](https://discord.gg/4a6R7ev)'}])})
};

module.exports.info = {
    description: 'About Shift',
    usage: 'about',
    maintainer: false,
    aliases: ['info']
}