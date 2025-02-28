const express = require("express");
const router = express.Router();
const {  createShop , getAllShops, getShopById } = require("../controllers/shopController");

router.post("/create", createShop);

// Route to fetch all shops
router.get("/shops", getAllShops);

// Route to get a specific shop by ID
router.get("/:id", getShopById); 

module.exports = router;


