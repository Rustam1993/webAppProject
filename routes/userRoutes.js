const express   = require('express');

const router    = express.Router();

const User      = require('../models/User');

const bcrypt    = require('bcryptjs');

const passport  = require('passport');

const Property  = require('../models/Property');

const uploader  = require('../config/cloud.js');


// Get signUp

router.get('/signup', (req,res,next) =>{
  res.render('user/signUP', {message: req.flash('error')})
})

// POST singUP
router.post('/signup', (req,res,next) =>{

User.findOne({email : req.body.email})
.then((theUser)=>{
if(theUser!==null){
  req.flash('error', 'sorry that username is already taken')
  res.redirect('/signup')
  return;
}

const salt    = bcrypt.genSaltSync(10);
const theHash = bcrypt.hashSync(req.body.passowrd, salt);

User.create({
  firstName: req.body.firstName,
  lastName:  req.body.lastName,
  email:     req.body.email,
  password:  theHash

})
.then((theUser) =>{
  req.login(theUser, (err) =>{
    if(err){
      req.flash('error', 'something went wrong with auto login, please log in manually')
      res.redirect('/login')
      return;
    }
    res.redirect('/profile')
  })
})
.catch((err) =>{
  next(err)
})

})
.catch((err)=>{
  next(err)
})

})

// Get login

router.get('/login', (req,res,next)=>{
  if(req.user){
    req.flash('error', 'you are already logged in')
    res.redirect('/')
  }
  else{
    res.render('user/login', {message: req.flash('error')})
  }
})


// POST logIn

router.post('/login' , passport.authenticate('local', {
  successRedirect:   '/profile',
  failureRedirect:   '/signup', 
  failureFlash:      'this user does not exist, please sign up',
  passReqToCallback: true

}))

// Get  log OUT

router.get('/logout' , (req,res,next) =>{
  req.logout();
  res.redirect('/login')
})



// Get Progile
router.get('/profile', (req,res,next)=>{

res.render('user/profile')

})



// User edit


router.get('/profile/edit' , (req,res,next) =>{
res.render('user/edit',)
})


router.post('/profile/edit', uploader.single('the-picture'), (req,res,next) =>{

  let userR = req.user;
  console.log(userR)
  let updatedContent;
  
  if(req.file===undefined) {
      updatedContent = 
      {
         phoneNumber: req.body.phoneNumber,
         bio:         req.body.bio,
         
      }
    }
      else {
        updatedContent = {

          phoneNumber: req.body.phoneNumber,
          bio:         req.body.bio,
          avatar:      req.file.url
        }
      }


  
  userR.update(updatedContent)
  .then(()=>{
    res.redirect('/profile')
  })
  .catch((err) =>{
    next(err)
  })
  
})


// Get req Check users properties

router.get('/profile/list-my-properties', (req,res,next) =>{
  Property.find({owner: req.user}).populate('owner')
  .then((findedProperty) =>{

    console.log(findedProperty.owner)
    res.render('user/myProperties' , {findedProperty: findedProperty})
  })
  .catch((err) =>{
    next(err)
  })
})



// get req for editing property


router.get('/profile/list-my-properties/edit/:id', (req,res,next) =>{
  Property.findById(req.params.id).populate('owner')
  .then((editedProperty) =>{
      res.render('user/editProperty', {editedProperty} )
  })
  .catch((err) =>{
    next(err)
  })
 


  // User.findOne({propertiesOwned: })
  // .then((findedUser) =>{


  //   res.render('user/editProperty', {findedUser:findedUser})
  // })
})






module.exports = router;