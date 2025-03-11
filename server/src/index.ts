import express from "express";
import dotenv from "dotenv";
import cors from "cors";
// import authRoutes from "./src/routes/authRoutes";
import slackRoutes from "./routes/slackRoutes";
// import jiraRoutes from "./src/routes/jiraRoutes";
// import driveRoutes from "./src/routes/driveRoutes";
// import githubRoutes from "./src/routes/githubRoutes";
//import { connectDB } from "./src/config/db";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Connect to Database
//connectDB();

// Routes
// app.use("/api/auth", authRoutes);
app.use("/api/slack", slackRoutes);
// app.use("/api/jira", jiraRoutes);
// app.use("/api/drive", driveRoutes);
// app.use("/api/github", githubRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));






