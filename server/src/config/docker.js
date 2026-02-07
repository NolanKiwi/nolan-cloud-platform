const Docker = require('dockerode');

// Initialize Docker connection
// Defaults to /var/run/docker.sock on Linux
const docker = new Docker();

module.exports = docker;
