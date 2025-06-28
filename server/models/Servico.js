const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Servico = sequelize.define("Servico", {
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    preco: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    categoria: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Servico.associate = (models) => {
    Servico.belongsToMany(models.Pedido, {
      through: models.Agendados,
      foreignKey: "servico_id",
      as: "pedido",
    });
  };

  return Servico;
};
