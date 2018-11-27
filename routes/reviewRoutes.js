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

  
    Review.create({
      author:     req.user._id,
      review:     req.body.review,
      rating:     req.body.rating,
      property:   req.params.id
    })
    .then((createdReview) =>{

      Property.findByIdAndUpdate({ _id: req.params.id}, {$push : {reviews : createdReview._id}}).populate('reviews')
    
      .then(() =>{
  
        User.findByIdAndUpdate({_id: req.user._id}, {$push: {reviews: createdReview._id}}).populate('reviews')
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



// list all reviews of User


router.get('/profile/all-reviews' , (req,res,next) =>{
  User.findOne({_id: req.user._id}).populate({path : 'reviews', populate: {path : 'property'}})
    .then((findedUser) =>{  


    res.render('user/allreviews', {findedUser:findedUser})

  })
  .catch((err) =>{

  })
})


// Edit review get request

router.get('/profile/all-reviews/:id/edit', (req,res,next) =>{
  
  Review.findById(req.params.id).populate('author').populate('property')
  .then((findedReview) =>{
    res.render('user/singleReview', {findedReview: findedReview})
  })
  .catch((err) =>{
    next(err)
  })
})

// Edit review POSt request


router.post('/profile/all-reviews/editNEW', (req,res,next) =>{
  
  Review.findOneAndUpdate({author: req.user._id}, {

    review: req.body.review,
    rating: req.body.rating
  }).populate('author')
  .then((updatedReview) =>{
    console.log("-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-",updatedReview)
    res.redirect('/profile')
  })
  .catch((err) =>{
    next(err)
  })

})

router.post('/profile/all-reviews/:id/delete', (req,res,next) =>{
  Review.findByIdAndDelete(req.params.id).populate('author').populate('property')
    .then((deletedReview) =>{
      User.findOneAndUpdate({email: req.user.email},{$pull: {reviews: deletedReview._id}})
      .then(() =>{
        Property.findOneAndUpdate({renters: req.user._id}, {$pull: {reviews: deletedReview._id}})
        .then(()=>{
          
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