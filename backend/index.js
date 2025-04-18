const express=require('express')
const dotenv=require('dotenv')
const mongoose=require('mongoose')
const userRoutes=require('./routes/UserRoutes.js')
const cookieParser=require('cookie-parser')
const cors=require('cors')
const problemRoutes=require('./routes/ProblemRoutes.js')
const path=require('path')


dotenv.config();


const _dirname=path.resolve();


const MONGODB_URI=process.env.MONGODB_URI;
const PORT=process.env.PORT||4000;

mongoose.connect(MONGODB_URI)


const app=express();
app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: "https://codetrack.onrender.com",
  credentials: true
}));

app.use('/api/auth',userRoutes)
app.use('/api/problems',problemRoutes)



app.listen(PORT)
