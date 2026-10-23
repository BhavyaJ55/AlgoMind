import express from "express"
import dotenv from "dotenv"

dotenv.config()

const app=express()

app.use(express.json())

app.get("/api/health",(req,res)=>{
    res.status(200).json({
        status:"ok",
        message : "running backend"
    })
})


app.listen(process.env.PORT , ()=>{
    console.log(`Server running successfully on ${process.env.PORT}`)
})