const nodemailer = require("nodemailer");

module.exports.sendMailNotifyUser = async (toEmail, name, host) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "ssninvente.contact@gmail.com",
      pass: "jayvishaal",
    },
  });

  let mailOptions = {
    from: "ssninvente.contact@gmail.com",
    to: toEmail,
    subject: "SSN Invente Payment Acceptance",
    text:
      "Dear " +
      name +
      ", \nYour Paytm Pass for SSN INVENTE 5.0 has been accepted and the points are added to your invente account.\n" +
      "You can now register for your favourite events! Please click on the following link, or paste this into your browser to complete the process:\n\n" +
      "https://" +
      host +
      "/event/register" +
      "\n\n" +
      "If it asks you to login, Pls do login!.\n\n Regards, \n SSN INVENTE DEV TEAM, \n SSN INVENTE 5.0",
  };

  return await transporter.sendMail(mailOptions);
};
