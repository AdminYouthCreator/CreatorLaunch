const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadProgramReceipt = (file) => {
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    throw new Error('Receipt storage is not configured.');
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'creatorlaunch/business-program/receipts',
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) return reject(new Error('Receipt upload failed.'));
        resolve({ publicId: result.public_id, url: result.secure_url });
      },
    );

    stream.end(file.buffer);
  });
};

module.exports = { uploadProgramReceipt };
