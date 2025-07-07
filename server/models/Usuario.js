const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Usuario = sequelize.define("Usuario", {
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    senha: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    tel: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    user_role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Usuario.associate = (models) => {
    Usuario.belongsTo(models.Plano, {
      foreignKey: "plano_id",
      as: "plano",
    });
    Usuario.hasMany(models.Pedido, {
      foreignKey: "usuario_id",
      as: "pedido",
    });
  };
  return Usuario;
};
