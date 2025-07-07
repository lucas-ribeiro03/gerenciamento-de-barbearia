const express = require("express");
const validateToken = require("../middlewares/AuthMiddleware");
const router = express.Router();

const { Pedido } = require("../models");

router.get("/card", validateToken, async (req, res) => {
  const { id } = req.user;
  const getOrder = await Pedido.findOne({
    where: { usuario_id: id },
    order: [["createdAt", "DESC"]],
  });

  return res.json(getOrder);
});

module.exports = router;
