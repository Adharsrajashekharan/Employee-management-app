const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const employeeRoutes=require('./routers/employeeRoutes')

const app=express()
app.use(express.json())
mongoose.connect("mongodb+srv://Adhars:Adhars1998@cluster0.fjkxciz.mongodb.net/99digits").then(()=>console.log("Db connected")).catch(()=>console.log("error in db"))
app.use(cors())
app.use('/',employeeRoutes)



app.listen(5000,()=>console.log("listening on 5000"))
