/*const Skill = require("../models/Skill");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});


exports.createSkill = async (req, res) => {
  console.log("Incoming request body:", req.body);
  console.log("Incoming file:", req.file); // Logs the file object from multer

  if (!req.file) {
    console.log("No file uploaded");
  }

  const { name, service, description, level, price, contact } = req.body;

  try {
    let cimageUrl = "";

    let pimageUrl = "";

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      cimageUrl = result.secure_url;
      console.log("Uploaded image URL:", cimageUrl);
    }

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      pimageUrl = result.secure_url;
      console.log("Uploaded image URL:", pimageUrl);
    }

    const newSkill = new Skill({
      name,
      service,
      description,
      level,
      contact,
      price,
      cimage: cimageUrl,
      pimage: pimageUrl,
    });

    await newSkill.save();
    res.status(201).json({ message: "Skill created successfully", skill: newSkill });
  } catch (error) {
    console.error("Error creating Skill:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};*/

const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const upload = multer({ dest: "uploads/" });
const Skill = require("../models/Skill");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

exports.createSkill = [
  upload.fields([
    { name: "image", maxCount: 1 }, // Shelf image
    { name: "memberImages", maxCount: 10 }, // Member images
  ]),
  async (req, res) => {
    try {
      console.log("📝 Received body:", req.body);
      console.log("🖼️ Received files:", req.files);

      const { name, description, stdprice, service, level, contact } = req.body;

      // Parse members from body
      let members = [];
      if (typeof req.body.members === "string") {
        members = JSON.parse(req.body.members);
      } else if (Array.isArray(req.body.members)) {
        members = req.body.members;
      }

      console.log("👥 Parsed members:", members);

      // Upload shelf image to Cloudinary
      let cImageUrl = "";
      if (req.files.image && req.files.image.length > 1) {
        const uploadResponse = await cloudinary.uploader.upload(req.files.image[0].path, {
          folder: "shelves",
        });
        cImageUrl = uploadResponse.secure_url;
        console.log("✅ Skill image uploaded:", cImageUrl);
      }

      let pImageUrl = "";
      if (req.files.image && req.files.image.length > 0) {
        const uploadResponse = await cloudinary.uploader.upload(req.files.image[0].path, {
          folder: "shelves",
        });
        pImageUrl = uploadResponse.secure_url;
        console.log("✅ Skill image uploaded:", pImageUrl);
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
      const newSkill = new Skill({
        name,
        description,
        service,
        level,
        stdprice,
        cimage: cImageUrl,
        pimage: pImageUrl,
        contact,
        members: uploadedMembers,
      });

      const savedSkill = await newSkill.save();
      console.log("✅ Shelf saved successfully:", savedSkill);

      res.status(201).json(savedSkill);
    } catch (error) {
      console.error("❌ Error creating shelf:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
];
