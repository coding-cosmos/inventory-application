const dotenv = require("dotenv");
const cloudinary = require("cloudinary").v2;

// Configure cloudinary
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

async function handleUpload(file) {
  const res = await cloudinary.uploader.upload(file, {
    resource_type: "auto",
  });
  return res;
}

async function uploadImageAndGetURL(req) {
  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    const result = await handleUpload(dataURI);
    return result.url;
  } catch (error) {
    console.log(error);
    res.send({
      message: error.message,
    });
  }
}

module.exports = uploadImageAndGetURL;