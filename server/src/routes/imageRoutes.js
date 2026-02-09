const express = require('express');
const router = express.Router();
const imageService = require('../services/imageService');

/**
 * GET /api/images
 * List all local images
 */
router.get('/', async (req, res) => {
  try {
    const images = await imageService.listImages();
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/images/pull
 * Pull an image from registry
 */
router.post('/pull', async (req, res) => {
  const { image } = req.body;
  if (!image) {
    return res.status(400).json({ error: 'Image name is required' });
  }

  try {
    await imageService.pullImage(image);
    res.json({ message: `Image ${image} pulled successfully` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /api/images/:id
 * Delete an image
 */
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await imageService.deleteImage(id);
    res.json({ message: `Image ${id} deleted successfully` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
