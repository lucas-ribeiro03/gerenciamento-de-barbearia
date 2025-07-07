const express = require("express");
const router = express.Router();
const { Agendados, Sequelize, Servico, Pedido } = require("../models");

router.get("/dayStats", async (req, res) => {
  const statsDia = await Pedido.findAll({
    where: {
      status: "finalizado",
      [Sequelize.Op.and]: [
        Sequelize.where(
          Sequelize.fn("DATE", Sequelize.col("pedido.updatedAt")),
          Sequelize.fn("CURDATE")
        ),
      ],
    },
  });

  const statsDiaAgendado = await Agendados.findAll({
    include: [{ model: Servico, as: "servico" }],
    where: {
      pedido_id: statsDia.map((pedido) => pedido.id),
      [Sequelize.Op.and]: [
        Sequelize.where(
          Sequelize.fn("DATE", Sequelize.col("agendados.updatedAt")),
          Sequelize.fn("CURDATE")
        ),
      ],
    },
  });

  const ganhosDoDia = statsDia.reduce(
    (acc, curr) => acc + Number(curr.preco),
    0
  );
  pedidosDoDia = statsDia.length;

  const serviceCounter = () => {
    const contador = {};
    for (const servico of statsDiaAgendado) {
      const id = servico.servico_id;
      if (!contador[id]) {
        contador[id] = { nome: servico.servico.nome, quantidade: 1 };
      } else {
        contador[id] = {
          nome: servico.servico.nome,
          quantidade: contador[id].quantidade + 1,
        };
      }
    }

    let maisRepetidoId = null;
    let maiorQuantidade = 0;
    let servico = "";

    for (const id in contador) {
      if (contador[id].quantidade > maiorQuantidade) {
        maiorQuantidade = contador[id].quantidade;
        maisRepetidoId = id;
        servico = contador[id].nome;
      }
    }
    return servico;
  };
  const maisPedido = serviceCounter();
  return res.json({ ganhosDoDia, pedidosDoDia, maisPedido });
});

router.get("/weekStats", async (req, res) => {
  const statsSemana = await Pedido.findAll({
    where: {
      status: "finalizado",
      [Sequelize.Op.and]: [
        Sequelize.where(
          Sequelize.fn("WEEK", Sequelize.col("pedido.updatedAt")),
          Sequelize.fn("WEEK", Sequelize.fn("NOW"))
        ),
      ],
    },
  });

  const statsSemanaAgendado = await Agendados.findAll({
    include: [{ model: Servico, as: "servico" }],
    where: {
      pedido_id: statsSemana.map((pedido) => pedido.id),
      [Sequelize.Op.and]: [
        Sequelize.where(
          Sequelize.fn("WEEK", Sequelize.col("agendados.updatedAt")),
          Sequelize.fn("WEEK", Sequelize.fn("NOW"))
        ),
      ],
    },
  });

  const serviceCounter = () => {
    const contador = {};
    for (const servico of statsSemanaAgendado) {
      const id = servico.servico_id;
      if (!contador[id]) {
        contador[id] = { nome: servico.servico.nome, quantidade: 1 };
      } else {
        contador[id] = {
          nome: servico.servico.nome,
          quantidade: contador[id].quantidade + 1,
        };
      }
    }

    let maisRepetidoId = null;
    let maiorQuantidade = 0;
    let servico = "";

    for (const id in contador) {
      if (contador[id].quantidade > maiorQuantidade) {
        maiorQuantidade = contador[id].quantidade;
        maisRepetidoId = id;
        servico = contador[id].nome;
      }
    }
    return servico;
  };
  const maisPedido = serviceCounter();
  const ganhosSemana = statsSemana.reduce(
    (acc, curr) => acc + Number(curr.preco),
    0
  );
  pedidosDaSemana = statsSemana.length;

  return res.json({ maisPedido, ganhosSemana, pedidosDaSemana });
});

router.get("/monthStats", async (req, res) => {
  const statsMes = await Pedido.findAll({
    where: {
      status: "finalizado",
      [Sequelize.Op.and]: [
        Sequelize.where(
          Sequelize.fn("WEEK", Sequelize.col("pedido.updatedAt")),
          Sequelize.fn("WEEK", Sequelize.fn("NOW"))
        ),
      ],
    },
  });

  const statsMesAgendado = await Agendados.findAll({
    include: [{ model: Servico, as: "servico" }],
    where: {
      pedido_id: statsMes.map((pedido) => pedido.id),
      [Sequelize.Op.and]: [
        Sequelize.where(
          Sequelize.fn("MONTH", Sequelize.col("agendados.updatedAt")),
          Sequelize.fn("MONTH", Sequelize.fn("NOW"))
        ),
      ],
    },
  });

  const serviceCounter = () => {
    const contador = {};
    for (const servico of statsMesAgendado) {
      const id = servico.servico_id;
      if (!contador[id]) {
        contador[id] = { nome: servico.servico.nome, quantidade: 1 };
      } else {
        contador[id] = {
          nome: servico.servico.nome,
          quantidade: contador[id].quantidade + 1,
        };
      }
    }

    let maisRepetidoId = null;
    let maiorQuantidade = 0;
    let servico = "";

    for (const id in contador) {
      if (contador[id].quantidade > maiorQuantidade) {
        maiorQuantidade = contador[id].quantidade;
        maisRepetidoId = id;
        servico = contador[id].nome;
      }
    }
    return servico;
  };
  const maisPedido = serviceCounter();
  const ganhosDoMes = statsMes.reduce(
    (acc, curr) => acc + Number(curr.preco),
    0
  );
  pedidosDoMes = statsMes.length;

  return res.json({ maisPedido, ganhosDoMes, pedidosDoMes });
});

module.exports = router;
