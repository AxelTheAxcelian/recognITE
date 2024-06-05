// src/routes/imageRoutes.js
'use strict';

const ImageController = require('../controllers/imageController');

const routes = [
  {
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      return 'API RecognITE';
    },
  },
  {
    method: 'POST',
    path: '/upload',
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        output: 'stream',
        maxBytes: 1024 * 1024 * 5, // 5MB
      },
    },
    handler: ImageController.uploadImage,
  },
  {
    method: 'GET',
    path: '/image/{filename}',
    handler: ImageController.getImage,
  },
];

module.exports = routes;
