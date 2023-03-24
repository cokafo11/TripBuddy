const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema(
  {
    picture: {
      type: String,
    },
    firstName: {
      type: String,

    },
    lastName: {
      type: String,

    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: { 
      type: String, 
      required: true 
    },
    phone: {
      type: String,


    },
    BOD: {
      type: Date,

    },
    address: {
      type: String,
    },
    country: {
      type: String,
    },
    city: {
      type: String,
    },
    postalCode: {
      type: String,
    },
    sex: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
    },
    cardNumber: {
      type: String,
      unique: true,
    },
    expirationDate: {
      type: Date,
    },
    CVC: {
      type: String,
    },
    subscription: {
      type: String,
      enum: ['Basic', 'Premium', 'Business'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    emergencyFirstName: {
      type: String,
    },
    emergencyLastName: {
      type: String,
    },
    emergencyEmail: {
      type: String,
    },
    emergencyPhone: {
      type: String,
    },
    subscribedTo: [String],
  },
  {
    timestamps: true,
    collection: "user",
  }
);

UserSchema.plugin(passportLocalMongoose);
const User = mongoose.model('User', UserSchema);
module.exports = User;
