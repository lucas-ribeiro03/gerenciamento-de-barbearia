const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Horario = sequelize.define("Horario", {
    dia: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    mes: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    hora: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isSelected: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  });

  return Horario;
};
