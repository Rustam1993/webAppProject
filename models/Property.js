const mongoose  = require('mongoose');
const Schema     = mongoose.Schema;



const propertySchema = new Schema({
owner:          {type: Schema.Types.ObjectId, ref: 'User'},
name:           String,
address:        String,
type:           String,
description:    String,
amenties:       String,
rating:         Number,
reviews:        {type: Schema.Types.Mixed , ref: 'Review', default: []},
price:          Number,
rentLength:     String,
image:          {type : String, default: "http://rawls-campbellagency.com/sites/default/files/styles/large/public/default_images/default-image.jpg"},
avgNumOfGuests: Number,
renters:        {type: Schema.Types.Mixed, ref: 'User' , default: []},
available:      {type: Boolean, default:true}

})
// reviews: [Schema.Types.ObjectId]

const Property  = mongoose.model('Property', propertySchema);


module.exports = Property;

