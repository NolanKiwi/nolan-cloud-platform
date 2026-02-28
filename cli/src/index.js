#!/usr/bin/env node

const { Command } = require('commander');
const Conf = require('conf').default;
const chalk = require('chalk');
const axios = require('axios');

const pkg = require('../package.json');
const config = new Conf({ projectName: 'ncp-cli' });
const program = new Command();

const getApiClient = () => {
  const apiUrl = config.get('apiUrl');
  const apiKey = config.get('apiKey');

  if (!apiUrl || !apiKey) {
    console.error(chalk.red('Error: API URL and API Key must be configured. Run "ncp config -u <url> -k <key>" first.'));
    process.exit(1);
  }

  return axios.create({
    baseURL: apiUrl,
    headers: { 'x-api-key': apiKey }
  });
};

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

program
  .command('ps')
  .description('List containers')
  .action(async () => {
    try {
      const api = getApiClient();
      const response = await api.get('/api/containers');
      const containers = response.data;
      
      if (containers.length === 0) {
        console.log(chalk.yellow('No containers found.'));
        return;
      }

      console.log(chalk.cyan('ID'.padEnd(15) + 'NAME'.padEnd(20) + 'IMAGE'.padEnd(25) + 'STATUS'.padEnd(15)));
      containers.forEach(c => {
        const id = c.Id.substring(0, 12);
        const name = c.Names[0].replace('/', '');
        const image = c.Image;
        const status = c.Status;
        console.log(`${id.padEnd(15)}${name.padEnd(20)}${image.padEnd(25)}${status.padEnd(15)}`);
      });
    } catch (error) {
      console.error(chalk.red(`Error: ${error.response?.data?.message || error.message}`));
    }
  });

program
  .command('run <image>')
  .description('Run a new container')
  .option('-n, --name <name>', 'Container name')
  .option('-p, --port <port>', 'Port mapping (e.g. 80:80)')
  .action(async (image, options) => {
    try {
      const api = getApiClient();
      const payload = { image };
      if (options.name) payload.name = options.name;
      if (options.port) {
        const [hostPort, containerPort] = options.port.split(':');
        payload.portBindings = {
          [`${containerPort}/tcp`]: [{ HostPort: hostPort }]
        };
      }
      
      const response = await api.post('/api/containers', payload);
      console.log(chalk.green(`Container started: ${response.data.id.substring(0, 12)}`));
    } catch (error) {
      console.error(chalk.red(`Error: ${error.response?.data?.message || error.message}`));
    }
  });

program
  .command('stop <id>')
  .description('Stop a container')
  .action(async (id) => {
    try {
      const api = getApiClient();
      await api.post(`/api/containers/${id}/stop`);
      console.log(chalk.green(`Container ${id} stopped.`));
    } catch (error) {
      console.error(chalk.red(`Error: ${error.response?.data?.message || error.message}`));
    }
  });

program.parse(process.argv);
