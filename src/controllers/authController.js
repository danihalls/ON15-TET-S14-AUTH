const UserSchema = require('../models/userSchema');
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const SECRET = process.env.SECRET

const login = (req, res) => {

    try{
        //userSchema.findOne(filtro é o email do usuario, funçao anonima)

        UserSchema.findOne({ email: req.body.email }, (error, user) => {
            console.log("USUÁRIO", user)
            if(!user) {
                return res.status(401).send({
                    message: "User não encontrado",
                    email: `${req.body.email}`
                })
            }

        // o que eu tenho: usuario que veio da requisiçao e o usuario encontrado no anco de dados, ambos
        //os usuarios possuem o mesmo email, agora preciso verificar se eles tambem possuem a mesma senha

        const validPassword = bcrypt.compareSync(req.body.password, user.password)
        console.log(validPassword)

        if(!validPassword) {
            return res.status(401).send({
                "message": "Login não autorizado"
            })
          }

          //jwt.sign(nome do usuario, segredo)
          const token = jwt.sign({name: user.name}, SECRET)
          console.log("TOKEN CRIADO", token)

          res.status(200).send({
            "message": "Login autorizado",
            token
          })
    
        })

    }catch(e) { 
        console.error(e)
    }

       
          
    
};

module.exports = {
    login
};