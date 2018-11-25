const mongoose  = require('mongoose');
const Schema     = mongoose.Schema;



const userSchema = new Schema({
  firstName:        {type: String, required: true},
  lastName:         {type: String, required: true},
  email:            {type: String, required: true},
  password:         {type: String, required: true},
  phoneNumber:      String,
  propertiesOwned:  {type: [Schema.Types.Mixed] , ref: 'Property'},
  propertiesRented: {type: [] , ref: 'Property'},
  avatar:           {type: String, default: "http://alumni.crg.eu/sites/default/files/default_images/default-picture_0_0.png"},
  bio:              String,
  reviews:          Array,
},
{
  timestamps: true
})


const User  = mongoose.model('User', userSchema);


module.exports = User;

