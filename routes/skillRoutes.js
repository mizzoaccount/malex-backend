const express = require("express");
const router = express.Router();
const { createSkill } = require("../controllers/skillController");

router.post("/create", createSkill);

// Route to fetch all shops
//router.get("/shops", getAllShops);

// Route to get a specific shop by ID
//router.get("/:id", getShopById); 

module.exports = router;
