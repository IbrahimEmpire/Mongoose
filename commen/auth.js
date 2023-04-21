const bcrypt = require("bcryptjs")
const { connect } = require("mongoose")
const jwt = require("jsonwebtoken")
const salted = 10
const sk = 'pg.jadmw2537'


const hasedPassword = async(password)=>{
    let salt = await bcrypt.genSalt(salted)
    let hasedPassword = await bcrypt.hash(password,salt)
    return hasedPassword
}

const passCompare = async(password, hasedPassword)=>{
    return await bcrypt.compare(password, hasedPassword)
}

const createTokan = async(paylode)=>{
    let token = await jwt.sign(paylode,sk,{expiresIn:'1m'})
    return token
}
const validator = async (req, res, next)=>{
    console.log(req.headers.authorization.split(" ")[1])
    if(req.headers.authorization){
        let tokan = req.headers.authorization.split(" ")[1]
        let data = jwt.decode(tokan)
        console.log(data)
    // console.log(Math.floor((+new Date()/1000)))
    if(Math.floor((+new Date()/1000)) < data.exp){

        next()
    }else{
        res.status(400).send({message:"token time out"})
    }
    }else{
        res.status(400).send({message:"invalid token"})
    }
}

const Role = async (req, res, next)=>{
    console.log(req.headers.authorization.split(" ")[1])
    if(req.headers.authorization){
        let tokan = req.headers.authorization.split(" ")[1]
        let data = await jwt.decode(tokan)
        console.log(data.role)
    // console.log(Math.floor((+new Date()/1000)))

    if(data.role === "admin"){

        next()
    }else{
        res.status(400).send({message:"sorry buddy its data only for admin"})
    }
    }else{
        res.status(400).send({message:"invalid token"})
    }
}

module.exports = {hasedPassword,passCompare, createTokan,validator,Role}



