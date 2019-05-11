const express = require("express");
const router = express.Router();
const User = require("../../Models/User");
const VGsUser = require("../../Models/VGS_User");
const validator = require('../../Validations/userValidations')

router.post("/login", async (req, res) => {
  try {
    const userExist = await User.findOne({
      email: /*req.body.email,*/{'$regex': req.body.email,$options:'i'},
      password: req.body.password
    });

    if (userExist) {
      try {
        const vgsUser = await VGsUser.findOne({ userId: userExist.id });
        if(vgsUser){
            return res.json({
                userId:userExist.id,
                vgsUsedId:vgsUser.id,
                userType: vgsUser.userType
            })
        }
        //not registered as vgs user
        else{
            return res.json({
                userId:userExist.id,
                vgsUsedId:null,
                userType: null
            })
        }
      } catch (error) {
        res.send("unexcpected error");
      }
    }
    else{
        res.status(203).send("Email or password are not correct");
    }
  } catch (err) {
    res.send("unexcpected error");
  }
});

router.post('/register', async(req, res)=>{
  try{
    const {error} = validator.createValidation(req.body)
    if(error) return res.status(500).send(error.details[0].message)
    const registerUser = await User.create(req.body)
    return res.send(registerUser)
  }
  catch(err){
    res.send("unexcpected error");
  }
})

module.exports = router;
