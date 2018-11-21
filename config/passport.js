const LocalStrategy   = require('passport-local').Strategy;
const bcrypt          = require('bcryptjs');
const passport        = require('passport');
const User            = require('../models/User');



passport.serializeUser((user, cb) =>{

  cb(null, user._id);

});


passport.deserializeUser((id, cb) =>{
  User.findById(id, (err, user) =>{
      if(err) {return cb(err)}
      cb(null, user);
  });
});



passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
},
  ((email, password, next) =>{
  User.findOne({email}, (err, user) =>{
    if(err) {return next(err)}
    if(!user){ return next(null, false, {message: "Incorrect username"})};
    if(!bcrypt.compareSync(password, user.password)) {return next(null, false, {message: "incorrect password"})}


    return next(null, user);


  })
})));