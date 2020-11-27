const nodemailer = require("nodemailer");

module.exports.sendMail = async (toEmail, token, host) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "scribeplus.contact@gmail.com",
      pass: "deeplearners",
    },
  });

  let mailOptions = {
    from: "invente.contact@gmail.com",
    to: toEmail,
    subject: "SSN Invente Password Reset",
    text:
      "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
      "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
      "http://" +
      host +
      "/auth/reset/" +
      token +
      "\n\n" +
      "If you did not request this, please ignore this email and your password will remain unchanged.\n",
  };

  return await transporter.sendMail(mailOptions);
};
