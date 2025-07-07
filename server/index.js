const express = require("express");
const app = express();
const mysql = require("mysql2");
const cors = require("cors");

const db = require("./models");
const authRoutes = require("./routes/Auth");
const servicesRoutes = require("./routes/Services");
const hourRoutes = require("./routes/Hours");
const scheduleRoutes = require("./routes/Schedule");
const orderRoutes = require("./routes/Orders");
const statsRoutes = require("./routes/Stats");
const userRoutes = require("./routes/Users");

app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/services", servicesRoutes);
app.use("/hours", hourRoutes);
app.use("/schedule", scheduleRoutes);
app.use("/order", orderRoutes);
app.use("/stats", statsRoutes);
app.use("/users", userRoutes);

db.sequelize.sync().then(() => {
  app.listen(3001, () => {});
});
