const express = require('express');
const router=express.Router()
const employeeModels=require('../models/employeeModels')

router.post('/api/employee',async(req,res)=>{
    console.log("yolo",req.body)
    const addEmployee= new employeeModels({
        id:req.body.id,
        name:req.body.name,
        dateOfBirth:req.body.dateOfBirth,
        email:req.body.email,
        phoneNumber:req.body.phoneNumber,
        salary:req.body.salary,
        gender:req.body.gender,

    })
    const saveItem=await addEmployee.save()
    res.status(200).json(saveItem)

})

router.get('/api/employee',async(req,res)=>{
    const getEmployee=await employeeModels.find({})
    res.status(200).json(getEmployee)
})

router.put('/api/employee/:id',async(req,res)=>{
    const editEmployee= await employeeModels.findByIdAndUpdate(req.params.id,{$set:req.body})
    res.json("employee Updated")
})

router.delete('/api/employee/:id',async(req,res)=>{
    const deleteEmployee=await employeeModels.findByIdAndDelete(req.params.id)
res.json("employee deleted")
})


module.exports=router