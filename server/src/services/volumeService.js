const docker = require('../config/docker');

const listVolumes = async () => {
  const volumesInfo = await docker.listVolumes();
  return volumesInfo.Volumes || [];
};

const createVolume = async (volumeConfig) => {
  const volume = await docker.createVolume(volumeConfig);
  return volume.inspect();
};

const removeVolume = async (name) => {
  const volume = docker.getVolume(name);
  await volume.remove();
  return { message: `Volume ${name} removed successfully` };
};

const inspectVolume = async (name) => {
  const volume = docker.getVolume(name);
  return await volume.inspect();
};

module.exports = {
  listVolumes,
  createVolume,
  removeVolume,
  inspectVolume
};
