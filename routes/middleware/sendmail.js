const nodemailer = require("nodemailer");

module.exports.sendMail = async (toEmail, token, host) => {
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
    subject: "SSN Invente Password Reset",
    text:
      "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
      "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
      "https://" +
      host +
      "/auth/reset/" +
      token +
      "\n\n" +
      "If you did not request this, please ignore this email and your password will remain unchanged.\n",
  };

  return await transporter.sendMail(mailOptions);
};

module.exports.sendSuperMail = async (toEmail, token, host) => {
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
    subject: "SSN Invente User Password Reset",
    text:
      "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
      "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
      "https://" +
      host +
      "/auth/super/reset/" +
      token +
      "\n\n" +
      "If you did not request this, please ignore this email and your password will remain unchanged.\n",
  };

  return await transporter.sendMail(mailOptions);
};

module.exports.sendHeadMail = async (toEmail, token, host) => {
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
    subject: "SSN Invente Event Head Password Reset",
    text:
      "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
      "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
      "https://" +
      host +
      "/auth/head/reset/" +
      token +
      "\n\n" +
      "If you did not request this, please ignore this email and your password will remain unchanged.\n",
  };

  return await transporter.sendMail(mailOptions);
};
