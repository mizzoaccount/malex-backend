const multer = require("multer");

// Set up multer for image upload (we're not saving images locally anymore)
const storage = multer.memoryStorage(); // Store the file in memory instead of disk
const upload = multer({ storage: storage });

module.exports = upload;
