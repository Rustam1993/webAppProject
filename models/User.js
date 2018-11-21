const mongoose  = require('mongoose');
const Shema     = mongoose.Shema;



const userSchema = new Shema({
username: {type: String, required: true},
password: String,
admin: Boolean},
{
  timestamps: true
})



