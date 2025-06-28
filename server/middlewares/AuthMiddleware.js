const { verify } = require("jsonwebtoken");

const validateToken = (req, res, next) => {
  const accessToken = req.header("accessToken");
  if (!accessToken) return res.json({ error: "Usuário não está logado" });

  try {
    const validToken = verify(accessToken, "09k3reuhcvn1dsjn2m1bxg4821n");
    req.user = validToken;
    if (validToken) return next();
  } catch (e) {
    return res.json({ error: "Erro ao gerar token", e });
  }
};

module.exports = validateToken;
