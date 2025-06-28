const express = require("express");
const router = express.Router();
const { Usuario } = require("../models");
const validateToken = require("../middlewares/AuthMiddleware");
const { where } = require("sequelize");

router.get("/", validateToken, async (req, res) => {
  const { id } = req.user;
  const user = await Usuario.findOne({ where: { id } });
  return res.json(user);
});

router.get("/barbeiros", async (req, res) => {
  const barbeiros = await Usuario.findAll({ where: { user_role: "admin" } });
  return res.json(barbeiros);
});

module.exports = router;
