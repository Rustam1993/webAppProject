const mongoose  = require('mongoose');
const Schema     = mongoose.Schema;


const reviewsSchema = new Schema({
author: String,
reviews: String,
rating: Number,
property: String,

})


const Review = mongoose.model('Review', reviewsSchema);



module.exports = Review;