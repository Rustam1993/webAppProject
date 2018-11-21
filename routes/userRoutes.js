const express   = require('express');

const router    = express.Router();

const User      = require('../models/User');

const bcrypt    = require('bcryptjs');

const passport  = require('passport');


// Get signUp

router.get('/signup', (req,res,next) =>{
  res.render('user/signUP')
})

// POST singUP
router.post('/signup', (req,res,next) =>{

User.findOne({username : req.body.email})
.then((theUser)=>{
if(theUser!==null){
  req.flash('error', 'sorry that username is already taken')
  res.redirect('/signup')
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
  failureFlash:      true,
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


router.get('/edit' , (req,res,next) =>{

res.render('user/edit')


})


module.exports = router;