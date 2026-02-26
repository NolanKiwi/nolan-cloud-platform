const Docker = require('dockerode');
const docker = new Docker({ socketPath: '/var/run/docker.sock' });

docker.version((err, data) => {
  if (err) {
    console.error('Error connecting to Docker:', err);
  } else {
    console.log('Docker version:', data.Version);
  }
});
