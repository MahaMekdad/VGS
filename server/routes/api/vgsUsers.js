const express = require('express');
const router = express.Router();
const VGS_User = require("../../Models/VGS_User");
const validator = require('../../Validations/vgsuserValidations')
const UserTable = require('../../Models/User')
const appStatusEnum = require('../../Models/Enums/Enums').Enum_appStatus;
const userTypeEnum = require('../../Models/Enums/Enums').Enum_userType;
const mongoose = require('mongoose')


// user filling an application form and we create new VGS user
router
    .route('/application_form')
    .post(async (req, res) => {
        try {
            const {error} = validator.createValidation(req.body)
            if(error) return res.status(500).send(error.details[0].message)
            const applicant = await VGS_User.create(req.body);
            return res.send(applicant)
        }
        catch (err) {
            res.status(500).send('something went wrong')
        }
    })

// viewing the application form for a user to see his/her status
router
    .route('/status/application_form_view/:id')
    .get(async (req, res) => {
        try{
            const accpetedApplicant = await VGS_User.findById(req.params.id)
            let status = appStatusEnum.getKey(accpetedApplicant.appStatus)
            return res.status(200).json({
                appStatus:status
            })
        }
        catch (error){
            return res.status(500).send(`error, we couldn't find the application form`)
        }
    })

// viewing all the application forms that are still not accepted nor rejected
router
    .route('/application_forms_view')
    .get(async (req, res) => {
        try {
            let user=null
            const allApplicationForms = await VGS_User.find({appStatus: appStatusEnum.Pending.value/*,userType:userTypeEnum.Applicant.value*/})
            if(allApplicationForms.length >0){
              let pendingApps=[]
              for(let i = 0 ; i < allApplicationForms.length ; i++){
                user = await UserTable.findOne({_id: allApplicationForms[i].userId})
                if(user != null){
                  pendingApps.push({
                    ApplicantName: user.name,
                    AppFormId: allApplicationForms[i].id,
                    clubCommittee: allApplicationForms[i].clubCommittee,
                    userType: allApplicationForms[i].userType,
                    hobbies: allApplicationForms[i].hobbies,
                    VGSYear: allApplicationForms[i].VGSYear,
                    gameName: allApplicationForms[i].gameName,
                    appStatus: allApplicationForms[i].appStatus
                  })
                }
              }
              return res.send(pendingApps)
            }
            else return res.status(203).send('no pending applications')

        }
        catch (error){
            return res.status(500).send(`error, we couldn't get the application forms`)
        }
    })

router 
    .route('/update/AppForm')
    .post(async (req,res)=>{
      try{
        const findAppForm = await VGS_User.findById({_id: req.body.AppId})
        if(findAppForm){
          await VGS_User.update({_id:req.body.AppId},{
            appStatus: req.body.appStatus
          })
          return res.status(200).send("updated")
        }
      }
      catch(err){
        return res.status(500).send('unexpected error')
      }

    })
// update applicant fields
router
    .route('/application_form_update/:id')
    .put(async (req, res) => {
        try{
            //const foundApplicant = await VGS_User.find(app => app.email == req.body.email)
            //if(!req.body.email) return res.status(400).send('email is required')
            //let foundApplicant = (await VGS_User.findOne({userId:req.body.id}))
            let foundApplicant = (await VGS_User.findById(req.params.id))
            if(!foundApplicant) return res.status(500).send(`the applicant with this id is not found, check the id`)
            // if(req.body.newEmail.trim()!='' || req.body.newEmail){
            //   let foundApplicantWithNewEmail = (await VGS_User.findOne({email:req.body.newEmail}))
            //   if(foundApplicantWithNewEmail)
            //    return res.status(500).send(`This email is already used`)
            // }
            else{
                await VGS_User.update({_id:req.params.id},
                    {
                    //email : (req.body.newEmail || foundApplicant.email),
                    clubCommittee : (req.body.clubCommittee || foundApplicant.clubCommittee),
                    hobbies: (req.body.hobbies  || foundApplicant.hobbies), 
                    appliedPosition: (req.body.appliedPosition  || foundApplicant.appliedPosition),
                    gameName : (req.body.gameName  || foundApplicant.gameName),
                    appStatus : appStatusEnum.Pending.value,
                    VGSYear: (+req.body.VGSYear || foundApplicant.VGSYear)
                    }
                )
            }
            return res.send('Updated')
        }
        catch (error){
            return res.status(501).send('error, failed to update')
        }
    })

router
    .route('/returnApplicant/:id')
    .get(async (req, res)=>{
      try{
        let foundApplication = await VGS_User.findById(req.params.id)
        if(!foundApplication) return res.status(500).send(`there's no application with this id`)
        let AppData = {
          userType: foundApplication.userType,
          clubCommittee: foundApplication.clubCommittee,
          hobbies: foundApplication.hobbies,
          VGSYear: foundApplication.VGSYear,
          appliedPosition: foundApplication.appliedPosition,
          gameName: foundApplication.gameName
        }
        return res.send(AppData)
      }
      catch(error){
        return res.status(501).send(error.message)
      }

    })
    
router.get('/getDirectors', async (req, res)=>{
  try{
    let _user
    let directorsData = []
    const directors = await VGS_User.find({userType: userTypeEnum.Director.value})
    if (directors){
      for(i = 0 ; i < directors.length ; i++){
        let userid = directors[i].userId
        if(mongoose.Types.ObjectId.isValid(userid)){

          _user = await UserTable.findById(userid)
          if(_user){
            directorsData.push({
              vgsUserId: directors[i].id,
              directorName: _user.name
            })
          }
          else return (res.status(500).send('unexpected error'))
        }
        else break
        //else return res.send('Please provide correct Id')
      }
    }
    return res.json({Directors: directorsData})
  }
  catch(error){
    return res.send(error.message)
  }
})

module.exports = router;
