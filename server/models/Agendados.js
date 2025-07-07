module.exports = (sequelize, DataTypes) => {
  const Agendados = sequelize.define("Agendados", {
    pedido_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Pedido",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    servico_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Servico",
        key: "id",
      },
      onDelete: "CASCADE",
    },
  });

  Agendados.associate = (models) => {
    Agendados.belongsTo(models.Pedido, {
      foreignKey: "pedido_id",
      as: "pedido",
    });

    Agendados.belongsTo(models.Servico, {
      foreignKey: "servico_id",
      as: "servico",
    });

    Agendados.belongsTo(models.Usuario, {
      foreignKey: "usuario_id",
      as: "usuario",
    });
  };

  return Agendados;
};
