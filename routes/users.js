var express = require('express');
var router = express.Router();
const {userModule} = require('../schemas/userSchemas')
const mongoose = require('mongoose')
const {dburl} = require('../commen/dbconfig')
const {hasedPassword, passCompare, createTokan,validator,Role} = require('../commen/auth')
mongoose.connect(dburl)

/* GET users listing. */



router.get("/",validator,Role, async function(req, res) {
try {
  let users = await userModule.find()
  res.status(200).send({
    users,
    message:"all data proceed"
  })
  
} catch (error) {
  res.status(500).send({
    message:"internal server 7 error",
    error
  })
}
})

// users get by id

router.get("/:id", async(req, res)=>{
try {
  let users = await userModule.findOne({userId: req.params.id})
  res.status(200).send({
    users,
    message:"hope you need"
  })
} catch (error) {
  res.status(500).send({
    message:"internal server error",
    error
  })
}
})



router.post('/singup', async(req, res) =>{
  try {
    let user = await userModule.findOne({email: req.body.email})
    if(!user){
      
      let hased = await hasedPassword(req.body.password)
      req.body.password = hased
      let user = await userModule.create(req.body)
      res.status(200).send({
        message: "signup succesfull"
      })
    }else{
      res.status(400).send({message: "its email already taken"},
      )
    }
    
  } catch (error) {
    console.log(error)
    res.status(500).send({message:"internal error"
    ,error}
    )
  }
 
})

// delete

router.delete("/:id", async(req, res)=>{
  try {
    let user = await userModule.findOne({userId: req.params.id})
    if(user){
      let user = await userModule.deleteOne({userId: req.params.id})
      res.status(200).send({
        message:" user delete seccesfuly"
      })
    }else{
      res.status(400).send({
        message:"users does not exist"
      })
    }
  } catch (error) {
    res.status(500).send({
message:"server error"
    })
    
  }
})

// put method

router.put("/:id", async(req, res)=>{
  try {
    let user = await userModule.findOne({userId: req.params.id})
    if(user){
      user.name= req.body.name,
      user.userID = req.body.userID,
      user.password = req.body.password,
      user.email= req.body.email

      await user.save()

      res.status(200).send("user uptade success")

    }else{
      res.status(500).send({
        message:"user does not exist"
      })
    }
    
  } catch (error) {
    res.status(500).send({
      message:"server error"
          })
    
  }
})
// login

router.post("/login", async(req, res)=>{
  try {
    let user = await userModule.findOne({email: req.body.email})
    if(user){
      if(await passCompare(req.body.password, user.password)){
        let tokan = await createTokan({
          name:user.name,
          email:user.email,
          role:user.role,
          id: user.userId
        })
        res.status(200).send({
          message:"login success",
          yourToken: tokan
        })
      }else{
        res.status(400).send({
          message:"incorrect password"
        })
      }
    }else{
      res.status(400).send({
        message:"user does not exist"
      })
    }
  } catch (error) {
    res.status(500).send({
      message:"server error"
    })
  }
})






module.exports = router;
