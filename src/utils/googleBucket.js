const { Storage } = require('@google-cloud/storage');
const fs = require('fs');
const util = require('util');
const path = require('path');

const stat = util.promisify(fs.stat);

const storage = new Storage({
  credentials: {
    client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY.replace(/\\n/g, '\n'),
  },
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
});

const bucket = storage.bucket(process.env.GOOGLE_CLOUD_STORAGE_BUCKET);

exports.uploadToGoogleBucket = async (file, destination, filename) => {
  try {
    if (!file) {
      throw new Error('No file provided');
    }

    const fileName = `${Date.now()}-${filename}`;
    const blob = bucket.file(fileName);
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
      resumable: false,
    });

    const filePath = path.join(destination, file.filename);

    // Wait for the file to be available
    await stat(filePath);

    return new Promise((resolve, reject) => {
      blobStream.on('error', (err) => reject(err));
      blobStream.on('finish', async () => {
        const [metadata] = await blob.getMetadata();
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${metadata.name}`;
        resolve(publicUrl);
      });

      fs.createReadStream(filePath).pipe(blobStream);
    });
  } catch (error) {
    console.error('Error uploading file to Google Cloud Storage:', error);
    throw error;
  }
};

exports.deleteFromGoogleBucket = async (url) => {
  try {
    const fileName = url.split('/').pop();
    const file = bucket.file(fileName);
    if (!file) {
      throw new Error('File not found');
    }
    await file.delete();
  } catch (error) {
    console.error('Error deleting file from Google Cloud Storage:', error);
    throw error;
  }
};
