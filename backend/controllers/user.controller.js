const passport = require('passport');
const authUtils = require('../utils/auth.js');
const User = require('../models/user.model');
const imageUpload = require('../config/imageUpload.config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const useNavigate = require('react-router-dom');
const { createNotification } = require('./notification.controller.js');

exports.getAuthImageUploadData = (req, res) => { // function for uploading images
  const result = imageUpload.getAuthenticationParameters()
  res.send(result);
}

exports.subscribeToContentProvider = async (req, res) => {
  try {
    const contentProviderId = req.params.id;
    const userId =  res.locals.userId;

    if (contentProviderId == userId){
      return res.status(409).send({success: false, message: `Cannot subscribe to one's own account`})
    }
    const contentProvider = await User.findById(contentProviderId)
    if (!contentProvider){
      return res.status(404).send({success: false, message: `Invalid content provider id`})
    }

    const user = await User.findById(userId)
    if (user?.subscribedTo?.includes(contentProviderId)){
      return res.status(409).send({success: false, message: `User is already subscribed to this content provider`})
    }

    await User.updateOne({_id: userId}, {$push: {subscribedTo: contentProviderId}})

    // send notification to the user
    await createNotification(res.locals.userId, `You are now following ${contentProvider.username} and can view their content`)

    // send notification to the content provider
    await createNotification(contentProviderId, `You have a new follower ${user.username} and now they can view your content`)

    return res.status(200).json({success: true, message: `Successfully subscribed`});
  } catch (error) {
    return res.status(500).send({success: false, message: `Server error: ${error.message}`})
  }
}

exports.cancelSubscribeToContentProvider = async (req, res) => {
  try {
    const contentProviderId = req.params.id;
    const userId =  res.locals.userId;

    const contentProvider = await User.findById(contentProviderId)
    if (!contentProvider){
      return res.status(404).send({success: false, message: `Invalid content provider id`})
    }

    const user = await User.findById(userId)
    if (!user?.subscribedTo?.includes(contentProviderId)){
      return res.status(409).send({success: false, message: `User has not subscribed to this content provider`})
    }

    await User.updateOne(
      { _id: res.locals.userId },
      { $pull: { subscribedTo: contentProviderId } }
    );

    // send notification to the user
    await createNotification(res.locals.userId, `You have cancelled following ${contentProvider.username}`)

    // send notification to the content provider
    await createNotification(contentProviderId, `${user.username} is no longer your follower`)

    return res.status(200).json({success: true, message: `Successfully cancel subscribed to a user`});
  } catch (error) {
    return res.status(500).send({success: false, message: `Server error: ${error.message}`})
  }
}

exports.processLogin = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    // are there any server errors?
    if (err) {
      console.error(err);
      res.end(err);
    }
    // are there any login errors?
    if (!user) {
      return res.json({ success: false, message: "ERROR: Authentication Failed" });
    }

    if (user.disable) {
      return res.json({ success: false, message: "Your account has been restricted" });
    }

    // no problems -  we have a good username and password
    req.logIn(user, (err) => {
      // are there any db errors?
      if (err) {
        console.error(err);
        res.end(err);
      }

      const authToken = authUtils.GenerateToken(user);
      return res.json({
        success: true,
        msg: "User Logged In Successfully",
        user: {
          id: user._id,
          displayName: user.firstName,
          username: user.username,
          emailAddress: user.email,
        },
        token: authToken,
      });
    });
  })(req, res, next);
};

exports.processRegistration = (req, res, next) => {
  //Instantiate a new user object
  let newUser = new User({
    ...req.body, //Javascript destructing
  });

  User.register(newUser, req.body.password, (err) => {
    // error validations
    if (err) {
      if (err.name === "UserExistsError") {
        console.error("ERROR: User Already Exists!");
      }

      console.log(err);

      return res.json({ success: false, message: "ERROR: Registration Failed!" });
    }

    // all ok - user has been registered
    return res.json({ success: true, message: "User Registered Successfully" });
  });
};

exports.processLogout = (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      console.error(err);
      res.end(err);
    }

    console.log("User Logged Out");
  });

  res.json({ success: true, message: "User logged out successfully" });
};