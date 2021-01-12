const { NotExtended } = require("http-errors");
module.exports.authSuperUser = (req, res, next) => {
  console.log("SUPER USER SESSION : ", req.session);
  if (
    req.session &&
    req.session.isSuperUser &&
    req.session.isSuperUserLogged &&
    req.session.superUserData
  ) {
    next();
  } else {
    return res.redirect("/");
  }
};

module.exports.authSuperUserCheck = (req, res, next) => {
  console.log("SUPER USER SESSION : ", req.session);
  if (req.session && req.session.isSuperUser && req.session.superUserData) {
    return res.redirect("/super/home");
  } else {
    next();
  }
};

module.exports.authRegUser = (req, res, next) => {
  console.log("SUPER USER SESSION : ", req.session);
  if (req.session && req.session.isRegUser && req.session.isRegUserLogged) {
    next();
  } else {
    return res.redirect("/");
  }
};

module.exports.authRegUserCheck = (req, res, next) => {
  console.log("SUPER USER SESSION : ", req.session);
  if (req.session && req.session.isRegUser && req.session.isRegUserLogged) {
    return res.redirect("/super/home");
  } else {
    next();
  }
};
