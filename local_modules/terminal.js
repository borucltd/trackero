const clear = require('clear');
const figlet = require('figlet');
const chalk = require('chalk');

function terminalClear() {

    // clear the screen
    clear();

    // print fancy logo
    console.log(chalk.red(figlet.textSync('Employee Tracker', { horizontalLayout: 'universal smushing' })));

}

module.exports = { terminalClear: terminalClear};
 