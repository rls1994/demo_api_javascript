const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name:{ type: String, required: [true,"Admin Name is Required"] },
  email:{ type: String, required: [true,"Admin Email is Required"] },
  phone:{ type: String, required: [true,"Admin Phone Number is Required"] },
  company:{ type: String, required: [true,"Company Name is Required"] },
  password_hash:{ type: String, required: [true,"Admin Password is Required"] },
  profile_pic:{ type: String, default:null },
  created_on: {type: Date, default: Date.now},
  modified_on: {type: Date, default: Date.now}
});
adminSchema.path('email').validate((val) => {
  emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(val);
}, 'Invalid Admin E-mail');

module.exports = mongoose.model('Admin', adminSchema)