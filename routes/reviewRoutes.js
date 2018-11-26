const express   = require('express');

const router    = express.Router();

const User      = require('../models/User');

const Property  = require('../models/Property');


const Review    = require('../models/Review')



// add a review to the property Get request

router.get('/profile/list-my-rented-properties/:id/add-review', (req,res,next) =>{
  Property.findById(req.params.id)
  .then((findedProperty) =>{
    User.findOne({email: req.user.email})
    .then((findedUser) =>{
      
      res.render('properties/leaveReview', {findedProperty:findedProperty, findedUser: findedUser})
    })
    .catch((err) =>{
      next(err)
    })
  })
  .catch((err) =>{
    next(err)
  })
})

// add a review POST request



router.post('/profile/list-my-rented-properties/:id/add-review', (req,res,next) =>{

  Property.findById(req.params.id)
  .then((findedProperty) =>{
    
    Review.create({
      author:     req.user,
      review:     req.body.review,
      rating:     req.body.rating,
      property:   findedProperty
    })
    .then((createdReview) =>{

      Property.findByIdAndUpdate({ _id: req.params.id}, {$push : {reviews : createdReview}}).populate('reviews')
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
  .catch((err) =>{
    next(err)
  })
})












module.exports = router;