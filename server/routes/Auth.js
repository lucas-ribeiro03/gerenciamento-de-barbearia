const express = require("express");
const router = express.Router();
const { Usuario } = require("../models");
const { where, Op } = require("sequelize");
const bcrypt = require("bcrypt");
const validateToken = require("../middlewares/AuthMiddleware");
const { sign } = require("jsonwebtoken");

router.post("/signup", async (req, res) => {
  const { nome, username, tel, email, senha } = req.body;
  const user_role = "cliente";
  let errors = [];

  if (email) {
    const checkIfEmailExists = await Usuario.findOne({
      where: {
        email,
      },
    });

    if (checkIfEmailExists)
      return res.json({
        error: {
          field: "email",
          message: "Email já cadastrado.",
        },
      });
  }

  if (tel) {
    const checkIfTelExists = await Usuario.findOne({
      where: {
        tel,
      },
    });

    if (checkIfTelExists)
      return res.json({
        error: {
          field: "tel",
          message: "Telefone já cadastrado.",
        },
      });
  }

  if (/[^a-zA-Z0-9_]/.test(username))
    errors.push({
      field: "username",
      message: "Apenas letras números e underline são permitidos",
    });

  if (senha.length < 6 || senha.length > 24)
    errors.push({
      field: "senha",
      message: "Senha deve conter entre 6 e 24 caractéres",
    });

  const checkIfUsernameExists = await Usuario.findOne({
    where: {
      username: username.trim().toLowerCase(),
    },
  });

  if (checkIfUsernameExists) {
    errors.push({
      field: "username",
      message: "Este username já está sendo utilizado",
    });
  }

  if (errors.length > 0) return res.json({ errors });

  const hashedPassword = await bcrypt.hash(senha, 10);
  const newUser = await Usuario.create({
    nome,
    username: username.trim().toLowerCase(),
    tel,
    email,
    senha: hashedPassword,
    user_role,
  });

  res.json(newUser);
});

router.post("/signupgoogle", async (req, res) => {
  const { nome, username, tel, email, senha, user_role } = req.body;
  const hashedPassword = await bcrypt.hash(senha, 10);
  if (email) {
    const checkIfEmailExists = await Usuario.findOne({
      where: {
        email,
      },
    });
    if (!checkIfEmailExists) {
      await Usuario.create({
        nome,
        username,
        tel,
        email,
        senha: hashedPassword,
        user_role,
      });
    }

    const user = await Usuario.findOne({
      where: {
        email,
      },
    });
    const accessToken = sign(
      {
        username: user.username,
        id: user.id,
      },
      "09k3reuhcvn1dsjn2m1bxg4821n"
    );
    res.json({ user, token: accessToken });
  }
});

router.post("/signin", async (req, res) => {
  const { identifier, senha } = req.body;
  const user = await Usuario.findOne({
    where: {
      [Op.or]: [{ email: identifier }, { username: identifier }],
    },
  });

  if (!user)
    return res.json({
      error: {
        field: "identifier",
        message: "Nome de usuário ou email não encontrado",
      },
    });

  const passCompare = await bcrypt.compare(senha, user.senha);
  if (!passCompare)
    return res.json({ error: { field: "senha", message: "Senha inválida" } });

  const accessToken = sign(
    { username: user.username, id: user.id },
    "09k3reuhcvn1dsjn2m1bxg4821n"
  );

  res.json({ user, token: accessToken });
});

router.get("/", validateToken, async (req, res) => {
  const { username } = req.user;
  const user = await Usuario.findOne({
    where: {
      username,
    },
  });
  res.json(user);
});

module.exports = router;
