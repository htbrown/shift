const chalk = require('chalk');

time = () => {
  let now = new Date();
  let date = new Date(now.getTime() - (now.getTimezoneOffset() * 60000));
  return date.toLocaleTimeString();
};

exports.info = (message) => {
    console.log(`${chalk.gray(time())} ${chalk.cyan('[i]')} ${message}`)
};

exports.success = (message) => {
    console.log(`${chalk.gray(time())} ${chalk.green('[✓]')} ${message}`)
};

exports.warn = (message) => {
    console.log(`${chalk.gray(time())} ${chalk.yellow('[!]')} ${message}`)
};

exports.error = (message) => {
    console.log(`${chalk.gray(time())} ${chalk.red('[x]')} ${message}`)
};