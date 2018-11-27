const mongoose  = require('mongoose');
const Schema     = mongoose.Schema;



const userSchema = new Schema({
  firstName:        {type: String, required: true},
  lastName:         {type: String, required: true},
  email:            {type: String, required: true},
  password:         {type: String, required: true},
  phoneNumber:      String,
  propertiesOwned:  {type: [] , ref: 'Property'},
  propertiesRented: {type: Schema.Types.Mixed , ref: 'Property', default: []},
  avatar:           {type: String, default: "http://alumni.crg.eu/sites/default/files/default_images/default-picture_0_0.png"},
  bio:              String,
  reviews:          {type: Schema.Types.Mixed, ref: 'Review', default: []},
},
{
  timestamps: true
})


const User  = mongoose.model('User', userSchema);


module.exports = User;

