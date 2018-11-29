const express   = require('express');

const router    = express.Router();

const User      = require('../models/User');

const Property  = require('../models/Property');

const Review    = require('../models/Review');

const uploader  = require('../config/cloud.js');






// List all properties

router.get('/properties', (req,res,next) =>{
  if(!req.user){
    req.flash('error', 'you have to sign up or log in to have access to  properties')
    res.render('user/login' , {message: req.flash('error')})
  }


  Property.find().populate('owner')
  .then((theProperty) =>{

    theProperty.forEach((eachProperty) =>{
      if(!eachProperty.owner._id.equals(req.user._id)){
        eachProperty.show = true;
      }
    })
    res.render('properties/property', {properties : theProperty})
  })
  .catch((err) =>{
    next(err)
  })
})

// List one property

router.get('/properties/:id', (req,res,next) =>{

Property.findById(req.params.id).populate({path : 'reviews', populate: {path : 'author'}})
  .then((findedProperty) =>{
    // console.log("==================== ", findedProperty);
    propRating = 0;
    findedProperty.reviews.forEach(oneReview => {
      propRating += oneReview.rating
    })
    propRating = (propRating / findedProperty.reviews.length).toFixed(2)

    if(isNaN(propRating)) {
      propRating = false;
    }

    // Review.find({property: req.params.id)})





    data = {
      propertyRating: propRating,
      findedProperty:findedProperty
    }
    console.log(" ------------------ ",data)
      res.render('properties/singleProperty', data)
    })
  .catch((err) =>{
    next(err)
  })
})

// Get list of all rented properties for user


router.get('/profile/list-my-rented-properties', (req,res,next) =>{
  User.findOne({email:req.user.email}).populate('propertiesRented')
  .then((findedUser) =>{

    res.render('user/rentedProperties', {findedUser: findedUser})

  })
  .catch((err) =>{
    next(err)
  })
})




// Get route for rent this

router.get('/properties/rent/:id', (req,res,next) =>{
  if(!req.user){
    req.flash('error', 'your have to be logged in to check rent this property')
    res.render('user/login', {message: req.flash('error')})
    return;
  }
  Property.findById(req.params.id)
  .then((findedProperty) =>{
    res.render('properties/rent' , {findedProperty : findedProperty})
  })
  .catch((err) =>{
    next(err)
  })
})

// Post request for rent property


router.post('/properties/rent/:id/submit', (req,res,next) =>{


  User.findById(req.user._id)

  .then((findedUser) =>{

    Property.findByIdAndUpdate(req.params.id, {$push: {renters : findedUser._id}}).populate('renters')

    .then((updatedProperty)=>{
      console.log(updatedProperty)
      User.findByIdAndUpdate(req.user._id, {$push: {propertiesRented : updatedProperty._id}}).populate('propertiesRented')
      .then((x) =>{
        console.log(x)
          res.redirect('/profile')
      })
      .catch((err) =>{
        next(err)
      })
    })
    .catch((err)=>{
      next(err)
    })
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

      User.findOneAndUpdate({email: req.user.email},{$push: {propertiesOwned: createdProperty._id }}).populate('propertiesOwned')
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



// Get req Check users properties

router.get('/profile/list-my-properties', (req,res,next) =>{
  Property.find({owner: req.user}).populate('owner')
  .then((findedProperty) =>{

    // console.log(findedProperty.owner)
    res.render('user/myProperties' , {allProperties: findedProperty})
  })
  .catch((err) =>{
    next(err)
  })
})





//  Get req Check exact user's property

router.get('/profile/list-my-properties/edit/:id', (req,res,next) =>{
  Property.findById(req.params.id).populate('owner')
  .then((editedProperty) =>{
      res.render('user/editProperty', {editedProperty: editedProperty })
  })
  .catch((err) =>{
    next(err)
  })

})


router.post('/profile/list-my-properties/edit/:id',uploader.single('image'), (req,res, next) =>{
  let updatedPropertyContent;

  if (req.file===undefined){ 
    updatedPropertyContent = {
      name           : req.body.name,
      address        : req.body.address,
      type           : req.body.type,
      description    : req.body.description,
      amenties       : req.body.amenties,
      rating         : req.body.rating,
      price          : req.body.price,  
      rentLength     : req.body.rentLength,
      avgNumOfGuests : req.body.avgNumOfGuests
    }
  }
  else 
  updatedPropertyContent = {
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

  

  Property.findByIdAndUpdate(req.params.id, updatedPropertyContent)
  .then(() =>{
    User.findOne({email:req.user.email})
    .then((findedUser) =>{
      console.log("-=-=-=-=-=-=-=-=-=-=-=-=-"+ typeof findedUser.propertiesOwned)
      res.redirect('/profile/list-my-properties')
    })
    .catch((err) =>{
      next(err)
    })

    
  })
  .catch((err) =>{
    next(err)
  })

})


router.post('/profile/list-my-properties/:id/delete', (req,res, next) =>{

Property.findByIdAndDelete(req.params.id)
.then((deletedProperty) =>{

  User.findOneAndUpdate({email: req.user.email}, {$pull : { propertiesOwned :   deletedProperty._id }})

  .then(() =>{
    
    res.redirect('/profile')
  })
  .catch((err) =>{
    next(err)
  })

})
.catch((err) =>{
  next(err)
})
})


module.exports = router;