require("dotenv").config(); // Load .env variables
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/db.config");
const router = require("./routes/router");

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Health check
app.get("/healthCheck", (req, res) => {
  res.status(200).json({ message: "Server is working ✅" });
});

// Routes
app.use("/", router);

// DB Connection & Server Start
connectDB().then(() => {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });

  app.on("error", (error) => {
    console.error("❌ App error:", error);
    process.exit(1);
  });
});
