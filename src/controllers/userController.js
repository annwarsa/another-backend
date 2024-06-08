const userService = require('../services/userService');
const googleBucket = require('../utils/googleBucket');
const Busboy = require('busboy');


exports.getUser = async (req, res) => {
  try {
    const user = await userService.getUser(req.userId);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const busboy = new Busboy({ headers: req.headers });
    let fields = {};
    let fileData = null;

    busboy.on('file', (fieldname, file, _filename, _encoding, _mimetype) => {
      if (fieldname === 'images') {
        const chunks = [];
        file.on('data', (chunk) => {
          chunks.push(chunk);
        });
        file.on('end', () => {
          fileData = Buffer.concat(chunks);
        });
      } else {
        file.resume();
      }
    });

    busboy.on('field', (fieldname, value) => {
      fields[fieldname] = value;
    });

    busboy.on('finish', async () => {
      const { username, email } = fields;

      if (!fileData) {
        return res.status(400).json({ error: 'Please provide an image' });
      }

      const imageUrl = await googleBucket.uploadToGoogleBucket(fileData);
      const user = await userService.updateUser(req.userId, username, email, imageUrl);
      res.status(200).json(user);
    });

    busboy.on('error', (err) => {
      console.error('Error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    });

    req.pipe(busboy);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};