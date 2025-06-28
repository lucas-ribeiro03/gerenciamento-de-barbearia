const { Servico } = require("../models");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const newProcedure = await Servico.create(req.body);

  return res.json(newProcedure);
});

router.get("/", async (req, res) => {
  const services = await Servico.findAll();
  return res.json(services);
});

router.put("/", async (req, res) => {
  const { id, nome, categoria, preco } = req.body;
  const edited = await Servico.update(
    {
      nome,
      categoria,
      preco,
    },
    { where: { id } }
  );
  return res.json(edited);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const deleted = await Servico.destroy({
    where: { id },
  });
  return res.json(deleted);
});
module.exports = router;
