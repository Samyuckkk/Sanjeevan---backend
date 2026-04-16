require("dotenv").config();

const { app } = require("./app");
const { connectToDatabase } = require("./config/db");
const { env } = require("./config/env");

const startServer = async () => {
  if (!env.mongoUri) {
    throw new Error("MONGO_URI is missing. Add it to backend/.env before starting the server.");
  }

  await connectToDatabase(env.mongoUri);

  app.listen(env.port, "0.0.0.0", () => {
    console.log(`Jobsly backend running on port ${env.port}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
