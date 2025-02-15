const Notification = require("../models/notification.model");
const User = require("../models/user.model");

const createNotification = async (userId, content, email = null) => {
  const notification = new Notification({
    notification: content,
    email: email,
    notificationFor: userId
  });

  await notification.save();
  return notification;
}

exports.createNotification = createNotification

exports.createNewNotification = async (req, res) => {
    try {
        const userId = res.locals.userId; // get user id from authentication middleware
        const notification = await createNotification(userId, req.body.notification, req.body.email)
        return res.status(200).json(notification);
      } catch (error) {
        return res
          .status(500)
          .send({ success: false, message: `Server error: ${error.message}` });
      }
}

exports.getNewNotifications = async (req, res) => {
  try {
      const userId = res.locals.userId; // get user id from authentication middleware
      const notifications = await Notification.find({notificationFor: userId, isRead: false})
      return res.status(200).json(notifications);
    } catch (error) {
      return res
        .status(500)
        .send({ success: false, message: `Server error: ${error.message}` });
    }
}

exports.deleteNotification = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).send({ success: false, message: `Notification not found` })
    }
    await Notification.deleteOne({ _id: notificationId });
    return res.status(200).json({ success: true, message: `Notification was successfully deleted` });
  } catch (error) {
    return res.status(500).send({ success: false, message: `Server error: ${error.message}` });
  }
}
