const volumeService = require('../services/volumeService');

const listVolumes = async (req, res) => {
  try {
    const volumes = await volumeService.listVolumes();
    res.json(volumes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createVolume = async (req, res) => {
  try {
    const volumeConfig = req.body;
    const volume = await volumeService.createVolume(volumeConfig);
    res.status(201).json(volume);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const inspectVolume = async (req, res) => {
  try {
    const { name } = req.params;
    const volume = await volumeService.inspectVolume(name);
    res.json(volume);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const removeVolume = async (req, res) => {
  try {
    const { name } = req.params;
    const result = await volumeService.removeVolume(name);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  listVolumes,
  createVolume,
  inspectVolume,
  removeVolume
};
