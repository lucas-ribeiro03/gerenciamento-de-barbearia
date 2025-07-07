const express = require("express");
const { Pedido, Agendados, Servico, Horario, Usuario } = require("../models");
const validateToken = require("../middlewares/AuthMiddleware");
const { where } = require("sequelize");
const router = express.Router();

router.post("/", async (req, res) => {
  const { barbeiro, data, servicos, preco } = req.body.scheduled;
  const { user } = req.body;

  console.log(servicos);

  if (!barbeiro || !servicos || !data)
    return res.json({ error: "Por favor, preencha todos os campos" });

  console.log(req.body.scheduled);

  await Horario.update(
    {
      isSelected: true,
    },
    { where: { dia: data.dia, mes: data.mes, hora: data.hora } }
  );

  const novoPedido = await Pedido.create({
    usuario_id: user.id,
    data: `${data.dia}/${data.mes}`,
    hora: `${data.hora}`,
    barbeiro,
    status: "confirmado",
    preco: servicos.reduce((acc, current) => acc + Number(current.preco), 0),
  });

  const servico = servicos.map((s) => ({
    pedido_id: novoPedido.id,
    usuario_id: user.id,
    servico_id: s.id,
  }));

  const agendar = await Agendados.bulkCreate(servico);

  return res.json(novoPedido);
});

router.get("/", validateToken, async (req, res) => {
  const getAgendados = await Agendados.findAll({
    include: [
      { model: Servico, as: "servico" },
      { model: Pedido, as: "pedido", where: { status: "confirmado" } },
      { model: Usuario, as: "usuario" },
    ],
  });
  return res.json(getAgendados);
});

router.get("/card", validateToken, async (req, res) => {
  const { id } = req.user;
  const pedido = await Pedido.findOne({
    where: {
      usuario_id: id,
      status: "confirmado",
    },
    order: [["createdAt", "DESC"]],
  });

  if (!pedido) return res.json();

  const agendados = await Agendados.findAll({
    where: { pedido_id: pedido.id },
    include: [{ model: Servico, as: "servico" }],
  });

  return res.json(agendados);
});

router.put("/", validateToken, async (req, res) => {
  const { id } = req.user;

  const pedido = await Pedido.findOne({
    where: { usuario_id: id },
    order: [["createdAt", "DESC"]],
  });

  await Pedido.update({ status: "cancelado" }, { where: { id: pedido.id } });
  await Horario.update(
    { isSelected: "false" },
    {
      where: {
        dia: pedido.data.slice(0, 1),
        mes: pedido.data.slice(3, 4),
        hora: pedido.hora,
      },
    }
  );

  await Agendados.destroy({
    where: { pedido_id: pedido.id },
  });
  return res.json("cancelado");
});

router.put("/admin", validateToken, async (req, res) => {
  const { action, id } = req.body;
  if (action === "finalizar") {
    await Pedido.update({ status: "finalizado" }, { where: { id } });
  } else if (action === "cancelar") {
    await Pedido.update({ status: "cancelado" }, { where: { id } });
    const pedido = await Pedido.findOne({ where: { id } });
    await Horario.update(
      { isSeled: false },
      {
        where: {
          dia: pedido.data.slice(0, 1),
          mes: pedido.data.slice(3, 4),
          hora: pedido.hora,
        },
      }
    );
  }
});

module.exports = router;
