const express   = require('express');

const router    = express.Router();

const User      = require('../models/User');

const Property  = require('../models/Property');

const uploader  = require('../config/cloud.js');


// List all properties

router.get('/properties', (req,res,next) =>{

let currentUser = req.user;

Property.find().populate('owner')
.then((theProperty) =>{
  res.render('properties/property', { properties : theProperty, currentUser: currentUser })
})
.catch((err) =>{
  next(err)
})

})

// Get req for add new property
router.get('/add-new-property', (req,res,next) =>{
  res.render('properties/newProperty')
})


// Post req for new property
router.post('/add-new-property', uploader.single('image'),  (req,res,next) =>{

  const newProperty = {
    name           : req.body.name,
    address        : req.body.address,
    type           : req.body.type,
    description    : req.body.description,
    amenties       : req.body.amenties,
    rating         : req.body.rating,
    price          : req.body.price,  
    rentLength     : req.body.rentLength,
    image          : req.file.url,
    avgNumOfGuests : req.body.avgNumOfGuests
  }

  newProperty.owner = req.user._id;


  Property.create(newProperty)
  .then((createdProperty) =>{

      User.findOneAndUpdate({email: req.user.email},{$push: {propertiesOwned: createdProperty}}).populate('propertiesOwned')
          .then(()=>{

            res.redirect('/properties')

          })
          .catch((err)=>{
            next(err)
          })

  })
  .catch((err) =>{
    next(err)
  })

})







module.exports = router;