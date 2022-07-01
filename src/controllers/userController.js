const UserSchema = require("../models/userSchema");
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const SECRET = process.env.SECRET

const getAll = async (req, res) => {
  const authHeader = req.get('authorization')
  const token = authHeader.split(' ')[1]
 

  if (!token) {
    return res.status(401).send("Erro no header")
  }

  jwt.verify(token, SECRET, (err) => {
    if(err) {
      return res.status(401).send("Não autorizado")
    }
  })
    
  UserSchema.find(function (err, users) {
    if(err) {
      res.status(500).send({ message: err.message })
    }
      res.status(200).send(users)
  }) 
}

const deleteId = async (req, res) => {
  try {
    const userId = req.params.id
    const deleteUser = await userSchema.findByIdAndDelete(userId) 

    res.status(200).json ({
      "message": "User deletado com sucesso",
      "usuário": deleteUser
  })


  }catch(error){
    console.error(error)

  }

}


const createUser = async (req, res) => {
  const hashedPassword = bcrypt.hashSync(req.body.password, 10)
  req.body.password = hashedPassword
  
  try {
    const newUser = new UserSchema(req.body)
    const saveUser = await newUser.save()

    res.status(201).send({
      "message": "User criado com sucesso",
      saveUser
    })

  } catch(error) {
    console.error(error)

  }

}

module.exports = {
  getAll,
  createUser
};
