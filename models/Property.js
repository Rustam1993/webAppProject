const mongoose  = require('mongoose');
const Schema     = mongoose.Schema;



const propertySchema = new Schema({
owner:          {type: Schema.Types.ObjectId, ref: 'User'},
name:           String,
address:        String,
type:           String,
description:    String,
amenties:       Array,
rating:         Number,
reviews:        {type: [Schema.Types.Mixed] , ref: 'Review'},
price:          Number,
rentLength:     String,
image:          String,
avgNumOfGuests: Number,
renters:        Array,
available:      {type: Boolean, default:true}

})


const Property  = mongoose.model('Property', propertySchema);


module.exports = Property;

