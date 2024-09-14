import cors from "cors";
import express, { json } from "express";
import { connect } from "mongoose";
import swaggerUi from "swagger-ui-express";
import { newsRouter } from "./routes/news.js";
import specs from "./swagger.js";
import helmet from "helmet";
import { configDotenv } from "dotenv";

configDotenv();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(json());

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })
);

const mongoURI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/allfunds";

connect(mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

app.use("/api/news", newsRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
