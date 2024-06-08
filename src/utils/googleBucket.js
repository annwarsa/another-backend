const { Storage } = require('@google-cloud/storage');

const storage = new Storage({
  credentials: {
    client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY.replace(/\\n/g, '\n'),
  },
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
});

const bucket = storage.bucket(process.env.GOOGLE_CLOUD_STORAGE_BUCKET);

exports.uploadToGoogleBucket = async (file) => {
  const fileName = `${Date.now()}-${file.originalname}`;
  const blob = bucket.file(fileName);
  const stream = blob.createWriteStream({
    metadata: {
      contentType: file.mimetype,
    },
  });

  return new Promise((resolve, reject) => {
    stream.on('error', (err) => reject(err));
    stream.on('finish', () => resolve(`https://storage.googleapis.com/${bucket.name}/${fileName}`));
    stream.end(file.buffer);
  });
};

exports.deleteFromGoogleBucket = async (url) => {
  const fileName = url.split('/').pop();
  await bucket.file(fileName).delete();
};
