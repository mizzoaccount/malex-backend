const express = require("express");
const router = express.Router();
const { createPortfolio } = require("../controllers/portfolioController");
const upload = require("../middleware/uploadMiddleware");

//router.post("/create", createPortfolio);
router.post("/create", upload.single("image"), createPortfolio);
// Route to fetch all shops
//router.get("/shops", getAllShops);

// Route to get a specific shop by ID
//router.get("/:id", getShopById); 

module.exports = router;