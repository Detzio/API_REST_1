require("dotenv").config();

const app = require("./app");
const connectDatabase = require("./config/database");

const port = Number(process.env.PORT) || 3000;

async function startServer() {
  try {
    await connectDatabase();
    app.listen(port, () => {
      console.log(`API disponible sur http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Impossible de démarrer l’API :", error.message);
    process.exitCode = 1;
  }
}

startServer();
