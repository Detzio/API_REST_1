const express = require("express");
const productRoutes = require("./routes/productRoutes");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

app.use(express.json());
app.get("/api/health", (req, res) => res.status(200).json({ status: "ok" }));
app.use("/api/products", productRoutes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
