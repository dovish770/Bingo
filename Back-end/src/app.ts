import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import router from "./Routes/Route";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());


const corsOptions = {
  origin: "http://localhost:5173", 
  credentials: true, 
};

app.use(cors(corsOptions));

connectDB();

app.use(cookieParser()); 
app.use("/api", router);



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
