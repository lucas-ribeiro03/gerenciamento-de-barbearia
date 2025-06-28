const express = require("express");
const router = express.Router();
const { Horario } = require("../models");

router.post("/", async (req, res) => {
  const horario = await Horario.create(req.body);
  return res.json(horario);
});

router.get("/", async (req, res) => {
  const horarios = await Horario.findAll({ where: { isSelected: false } });
  return res.json(horarios);
});

router.delete("/:day/:month/:hour", async (req, res) => {
  const { day, month, hour } = req.params;
  await Horario.destroy({
    where: {
      dia: day,
      mes: month,
      hora: hour,
    },
  });
});
module.exports = router;
