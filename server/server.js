import express from "express";
import cors from "cors"
import "dotenv/config" ;
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import resumeRouter from "./routes/resumeRoutes.js";
import aiRouter from "./routes/aiRoutes.js";
import mongoose from "mongoose";

const app = express();
const PORT = process.env.PORT || 3000;

await connectDB();


// let isConnected = false;
// async function connectToMongoDB() {
//   try {
//     await mongoose.connect(process.env.MONGODB_URI, {
//       useNewUrlParser : true,
//       useUnifiedTopology : true
//     });

//     isConnected = true;

//     console.log("connected to mongodb");

//   } catch (error) {
//     console.log("error connecting to mongodb", error)
//   }
// }
//adding middleware
// app.use((req, res, next) => {
//   if(!isConnected){
//     connectToMongoDB();
//   }
//   next();
// })

app.use(express.json());
app.use(cors());
app.use(
  cors({
    origin: "https://resume-builder-client-59ys.onrender.com", // or "*"
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"], 
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.get("/",(req , res) => res.send("Server is live..."));
app.use("/api/users", userRouter);
app.use("/api/resume", resumeRouter)
app.use("/api/ai", aiRouter)
 

app.listen(PORT, ()=>console.log(`server is running on port ${PORT}`));

// module.exports = app;
