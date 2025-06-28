const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Plano = sequelize.define("Plano", {
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    valor: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
  Plano.associate = (models) => {
    Plano.hasMany(models.Usuario, {
      foreignKey: "plano_id",
      as: "usuarios",
    });
  };

  return Plano;
};
