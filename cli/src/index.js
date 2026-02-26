#!/usr/bin/env node

const { Command } = require('commander');
const Conf = require('conf').default;
const chalk = require('chalk');

const pkg = require('../package.json');
const config = new Conf({ projectName: 'ncp-cli' });
const program = new Command();

program
  .name('ncp')
  .description('Nolan Cloud Platform CLI')
  .version(pkg.version);

program
  .command('config')
  .description('Configure API settings')
  .option('-u, --url <url>', 'NCP API URL')
  .option('-k, --key <key>', 'NCP API Key')
  .action((options) => {
    if (options.url) {
      config.set('apiUrl', options.url);
      console.log(chalk.green(`API URL set to: ${options.url}`));
    }
    if (options.key) {
      config.set('apiKey', options.key);
      console.log(chalk.green(`API Key set to: ${options.key}`));
    }
    
    if (!options.url && !options.key) {
      console.log(chalk.cyan('Current Configuration:'));
      console.log(`API URL: ${config.get('apiUrl') || 'Not set'}`);
      console.log(`API Key: ${config.get('apiKey') ? '********' : 'Not set'}`);
    }
  });

program.parse(process.argv);
