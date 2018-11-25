const mongoose  = require('mongoose');
const Schema     = mongoose.Schema;


const reviewsSchema = new Schema({
author: {type: Schema.Types.ObjectId, ref: 'User'},
review: String,
rating: Number,
property: {type: Schema.Types.ObjectId, ref: 'Property'}
})


const Review = mongoose.model('Review', reviewsSchema);


module.exports = Review;  