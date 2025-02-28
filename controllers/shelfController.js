/*const cloudinary = require("cloudinary");
const Shelf = require("../models/Shelf"); // Assuming the model is in a 'models' folder

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const multer = require("multer");
// Configure multer to handle file uploads
const upload = multer({ dest: "uploads/" }); // You can customize this path

// Controller to create a new shelf
exports.createShelf = [
  upload.single("image"),  // This middleware will handle the 'image' field from the FormData
  async (req, res) => {
    try {
      console.log("Received request body:", req.body); // Log the request body to ensure it's being received
      console.log("Files in request:", req.file); // Log the files in the request

      const { name, description, price } = req.body;
      let { members } = req.body;

      console.log("Destructured values - Name:", name, "Description:", description, "Price:", price, "Members:", members);

      // Ensure members is parsed as an array of objects
      try {
        members = JSON.parse(members);
      } catch (err) {
        console.error("Error parsing members:", err);
        members = []; // Default to empty array if parsing fails
      }

      // 'image' should now be available in req.file
      const image = req.file;  // If you use .single('image'), it will be available as req.file
      console.log("Image file:", image); // Log image file

      if (!name || !description || !price || !members || !image) {
        console.log("Validation failed - Missing fields");
        return res.status(400).json({ message: "All fields are required" });
      }

      // Upload the image to Cloudinary
      console.log("Uploading image to Cloudinary...");
      const uploadResponse = await cloudinary.uploader.upload(image.path, {
        folder: "shelves", // Optional: Specify a folder in Cloudinary
      });
      console.log("Cloudinary upload response:", uploadResponse); // Log the Cloudinary upload response

      // Create a new shelf
      const newShelf = new Shelf({
        name,
        description,
        image: uploadResponse.secure_url, // Use the URL returned from Cloudinary
        price,
        members,
      });

      // Save the new shelf to the database
      console.log("Saving new shelf to the database...");
      const savedShelf = await newShelf.save();
      console.log("Saved shelf:", savedShelf); // Log the saved shelf

      // Respond with the saved shelf
      return res.status(201).json(savedShelf);
    } catch (error) {
      console.error("Error creating shelf:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
];*/

/*const cloudinary = require("cloudinary");
const Shelf = require("../models/shelf"); // Assuming the model is in a 'models' folder

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const multer = require("multer");
// Configure multer to handle file uploads
const upload = multer({ dest: "uploads/" }); // Customize this path if necessary

// Controller to create a new shelf
exports.createShelf = [
  upload.fields([
    { name: 'image', maxCount: 1 }, // For shelf image
    { name: 'members', maxCount: 10 } // Max number of member images to upload
  ]),
  async (req, res) => {
    try {
      console.log("Received request body:", req.body); // Log the request body
      console.log("Files in request:", req.files); // Log the files

      const { name, description, price } = req.body;
      let { members } = req.body;

      // Parse members from the JSON string
      try {
        members = JSON.parse(members);
      } catch (err) {
        console.error("Error parsing members:", err);
        members = []; // Default to empty array if parsing fails
      }

      // Upload the shelf image to Cloudinary
      const shelfImage = req.files.image ? req.files.image[0] : null;
      let shelfImageUrl = "";
      if (shelfImage) {
        console.log("Uploading shelf image to Cloudinary...");
        const uploadResponse = await cloudinary.uploader.upload(shelfImage.path, {
          folder: "shelves",
        });
        shelfImageUrl = uploadResponse.secure_url;
      }

      // Upload member images to Cloudinary
      const uploadedMembers = [];
      for (let i = 0; i < members.length; i++) {
        const memberImage = req.files.members && req.files.members[i] ? req.files.members[i][0] : null;
        if (memberImage) {
          console.log(`Uploading member ${i + 1} image to Cloudinary...`);
          const uploadResponse = await cloudinary.uploader.upload(memberImage.path, {
            folder: "members",
          });
          members[i].image = uploadResponse.secure_url; // Assign the image URL to the member
        }
        uploadedMembers.push(members[i]);
      }

      if (!name || !description || !price || !uploadedMembers || !shelfImageUrl) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // Create the new shelf in the database
      const newShelf = new Shelf({
        name,
        description,
        image: shelfImageUrl, // Use the shelf image URL from Cloudinary
        price,
        members: uploadedMembers,
      });

      // Save the new shelf to the database
      const savedShelf = await newShelf.save();

      return res.status(201).json(savedShelf);
    } catch (error) {
      console.error("Error creating shelf:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
];*/
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const upload = multer({ dest: "uploads/" });
const Shelf = require("../models/Shelf");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

exports.createShelf = [
  upload.fields([
    { name: "image", maxCount: 1 }, // Shelf image
    { name: "memberImages", maxCount: 10 }, // Member images
  ]),
  async (req, res) => {
    try {
      console.log("📝 Received body:", req.body);
      console.log("🖼️ Received files:", req.files);

      const { name, description, price } = req.body;

      // Parse members from body
      let members = [];
      if (typeof req.body.members === "string") {
        members = JSON.parse(req.body.members);
      } else if (Array.isArray(req.body.members)) {
        members = req.body.members;
      }

      console.log("👥 Parsed members:", members);

      // Upload shelf image to Cloudinary
      let shelfImageUrl = "";
      if (req.files.image && req.files.image.length > 0) {
        const uploadResponse = await cloudinary.uploader.upload(req.files.image[0].path, {
          folder: "shelves",
        });
        shelfImageUrl = uploadResponse.secure_url;
        console.log("✅ Shelf image uploaded:", shelfImageUrl);
      }

      // Upload each member's image and associate it with their data
      const uploadedMembers = await Promise.all(
        members.map(async (member, index) => {
          let memberImageUrl = "";

          console.log(`🔍 Processing member ${index + 1}:`, member);

          if (req.files.memberImages && req.files.memberImages[index]) {
            console.log(`📸 Uploading image for member ${index + 1}:`, req.files.memberImages[index]);

            const uploadResponse = await cloudinary.uploader.upload(req.files.memberImages[index].path, {
              folder: "members",
            });

            memberImageUrl = uploadResponse.secure_url;
            console.log(`✅ Member ${index + 1} image uploaded:`, memberImageUrl);
          } else {
            console.log(`⚠️ No image found for member ${index + 1}`);
          }

          return {
            ...member,
            image: memberImageUrl, // Assign uploaded image URL to the member
          };
        })
      );

      console.log("📌 Final members data:", uploadedMembers);

      // Save shelf to database
      const newShelf = new Shelf({
        name,
        description,
        image: shelfImageUrl,
        price,
        members: uploadedMembers,
      });

      const savedShelf = await newShelf.save();
      console.log("✅ Shelf saved successfully:", savedShelf);

      res.status(201).json(savedShelf);
    } catch (error) {
      console.error("❌ Error creating shelf:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
];
