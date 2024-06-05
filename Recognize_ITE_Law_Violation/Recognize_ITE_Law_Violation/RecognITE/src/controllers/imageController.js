// src/controllers/imageController.js
'use strict';

const fs = require('fs');
const path = require('path');
const util = require('util');
const mkdirp = require('mkdirp');
const sharp = require('sharp');

const writeFile = util.promisify(fs.writeFile);
const unlink = util.promisify(fs.unlink);

const uploadDir = path.join(__dirname, '../../public/uploads');
mkdirp.sync(uploadDir);

const ImageController = {
  uploadImage: async (request, h) => {
    const data = request.payload;
    if (data.file) {
      const filename = data.file.hapi.filename;
      const filepath = path.join(uploadDir, filename);
      const file = fs.createWriteStream(filepath);

      await data.file.pipe(file);

      await new Promise((resolve, reject) => {
        file.on('finish', resolve);
        file.on('error', reject);
      });

      // Resize image
      const resizedFilePath = path.join(uploadDir, `resized-${filename}`);
      await sharp(filepath).resize(800, 800).toFile(resizedFilePath);

      // Remove the original file
      await unlink(filepath);

      return h.response({ message: 'File uploaded successfully', filename: `resized-${filename}` }).code(200);
    }

    return h.response({ error: 'No file uploaded' }).code(400);
  },

  getImage: (request, h) => {
    const filename = request.params.filename;
    const filepath = path.join(uploadDir, filename);

    if (fs.existsSync(filepath)) {
      return h.file(filepath);
    }

    return h.response({ error: 'File not found' }).code(404);
  },
};

module.exports = ImageController;
