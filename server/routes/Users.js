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

router.put("/", validateToken, async (req, res) => {
  const { nome, username, tel, email } = req.body;
  const { id } = req.user;

  if (!nome || !username || !tel || !email) return;

  await Usuario.update(
    {
      nome,
      username,
      tel,
      email,
    },
    { where: { id } }
  );

  return res.json(mensgem);
});

module.exports = router;
