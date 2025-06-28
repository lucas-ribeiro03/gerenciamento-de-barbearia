const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Pedido = sequelize.define("Pedido", {
    data: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    hora: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    barbeiro: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    preco: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Pedido.associate = (models) => {
    Pedido.belongsTo(models.Usuario, {
      foreignKey: "usuario_id",
      as: "usuario",
    });

    Pedido.belongsToMany(models.Servico, {
      through: models.Agendados,
      foreignKey: "pedido_id",
      as: "servico",
    });
  };
  return Pedido;
};
