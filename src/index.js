const express = require('express')

const connect = require('./configs/db')
const {register,login} = require('./controllers/auth.controllers')
const userController = require('./controllers/user.controllers')
const productController = require("./controllers/product.controllers")
const passport = require("./configs/google-auth")

const app = express()


app.use(express.json())



app.post("/register", register)
app.post("/login", login)


app.use("/user",userController)
app.use("/products", productController)



app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));
 
app.get(
'/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login', session:false } ),

  function(req, res) {
    const token = generateToken(req.user)
    return res.status(200).send({user:req.user, token})
  }
)


app.listen(3000,async()=>{
try {

    await connect()
    console.log("Listening to port 3000");
} catch (err) {
    console.log("Something went wrong");
}
})

