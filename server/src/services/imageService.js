const docker = require('../config/docker');

class ImageService {
  /**
   * List all images
   * @returns {Promise<Array>} List of images
   */
  async listImages() {
    try {
      const images = await docker.listImages();
      return images.map(image => ({
        id: image.Id,
        repoTags: image.RepoTags,
        created: new Date(image.Created * 1000).toISOString(),
        size: image.Size,
        virtualSize: image.VirtualSize
      }));
    } catch (error) {
      console.error('Error listing images:', error);
      throw error;
    }
  }

  /**
   * Pull an image from registry
   * @param {string} image - Image name (e.g., 'nginx:latest')
   * @returns {Promise<void>}
   */
  async pullImage(image) {
    try {
      return new Promise((resolve, reject) => {
        docker.pull(image, (err, stream) => {
          if (err) return reject(err);
          docker.modem.followProgress(stream, onFinished, onProgress);

          function onFinished(err, output) {
            if (err) return reject(err);
            resolve(output);
          }

          function onProgress(event) {
            // Can log progress here if needed
          }
        });
      });
    } catch (error) {
      console.error(`Error pulling image ${image}:`, error);
      throw error;
    }
  }

  /**
   * Delete an image
   * @param {string} id - Image ID or name
   * @returns {Promise<void>}
   */
  async deleteImage(id) {
    try {
      const image = docker.getImage(id);
      await image.remove();
    } catch (error) {
      console.error(`Error deleting image ${id}:`, error);
      throw error;
    }
  }
}

module.exports = new ImageService();
