const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const userRoutes = require("./routes/UserRoutes.js");
const problemRoutes = require("./routes/ProblemRoutes.js");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

dotenv.config();

const __dirname = path.resolve();

const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 4000;

mongoose.connect(MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "https://codetrack.onrender.com",
  credentials: true
}));

app.get("/", (req, res) => {
  res.send("Codetrack backend is running 🚀");
});

app.use("/api/auth", userRoutes);
app.use("/api/problems", problemRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
