const fs = require('fs');
module.exports = async (client, message, args) => {
    let commands = [];
    let f1 = [];
    let f2 = [];
    let f3 = [];
    let f4 = [];
    fs.readdirSync('./commands/').forEach(f => {
        if (require(`./${f}`).info.maintainer == true && !require('../configuration/config.js').maintainers.includes(message.author.id)) {
            return;
        } else {
            commands.push([f.substring(0, f.length-3), require(`./${f}`).info.description + `\nUsage: ${require(`./${f}`).info.usage}`]);
            let cmdlength = commands.length + 1;

            if (cmdlength > 75) return f4.push([f.substring(0, f.length-3), require(`./${f}`).info.description + `\nUsage: ${require(`./${f}`).info.usage}`]);
            else if (cmdlength > 50) return f3.push([f.substring(0, f.length-3), require(`./${f}`).info.description + `\nUsage: ${require(`./${f}`).info.usage}`]);
            else if (cmdlength > 25) return f2.push([f.substring(0, f.length-3), require(`./${f}`).info.description + `\nUsage: ${require(`./${f}`).info.usage}`]);
            else return f1.push([f.substring(0, f.length-3), require(`./${f}`).info.description + `\nUsage: ${require(`./${f}`).info.usage}`]);
        }
    });
    message.channel.send({embed: client.util.embed(message, '📬 Check your DMs.')});

    message.author.send({embed: client.util.embed(message, '📕 Here\'s a list of commands:', undefined, '() = Optional   [] = Required', undefined, f1.map(c => {return {name: c[0], value: c[1]}}))})

    if (f2.length !== 0) {
        message.author.send({embed: client.util.embed(message, '📕 Here\'s a list of commands:', undefined, '() = Optional   [] = Required', undefined, f2.map(c => {return {name: c[0], value: c[1]}}))})
    };
    if (f3.length !== 0) {
        message.author.send({embed: client.util.embed(message, '📕 Here\'s a list of commands:', undefined, '() = Optional   [] = Required', undefined, f3.map(c => {return {name: c[0], value: c[1]}}))})
    }
    if (f4.length !== 0) {
        message.author.send({embed: client.util.embed(message, '📕 Here\'s a list of commands:', undefined, '() = Optional   [] = Required', undefined, f4.map(c => {return {name: c[0], value: c[1]}}))})
    }
}

module.exports.info = {
    description: 'Gives you information on the different commands you can run.',
    usage: 'help',
    maintainer: false
}