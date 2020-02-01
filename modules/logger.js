const chalk = require('chalk');

let date = new Date();

exports.info = (message) => {
    date = new Date();
    console.log('[' + chalk.cyan(`i`) + '|' + chalk.cyan(`${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`) + ']' + chalk.cyan(` ${message}`))
}

exports.success = (message) => {
    date = new Date();
    console.log('[' + chalk.green(`✓`) + '|' + chalk.green(`${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`) + ']' + chalk.green(` ${message}`))
}

exports.warn = (message) => {
    date = new Date();
    console.log('[' + chalk.yellow(`!`) + '|' + chalk.yellow(`${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`) + ']' + chalk.yellow(` ${message}`))
}

exports.error = (message) => {
    date = new Date();
    console.log('[' + chalk.red(`X`) + '|' + chalk.red(`${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`) + ']' + chalk.red(` ${message}`))
}