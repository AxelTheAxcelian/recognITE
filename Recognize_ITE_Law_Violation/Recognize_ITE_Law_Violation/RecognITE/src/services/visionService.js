const axios = require('axios');

const processImage = async (imageBuffer) => {
  try {
    const imageBase64 = imageBuffer.toString('base64');
    const response = await axios.post(`https://vision.googleapis.com/v1/images:annotate?key=${process.env.GOOGLE_CLOUD_VISION_API_KEY}`, {
      requests: [
        {
          image: {
            content: imageBase64,
          },
          features: [{ type: 'LABEL_DETECTION', maxResults: 10 }, { type: 'TEXT_DETECTION' }],
        },
      ],
    });

    console.log('Google Vision API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in processImage:', error);
    throw new Error('Failed to process image with Google Vision API');
  }
};

module.exports = {
  processImage,
};
