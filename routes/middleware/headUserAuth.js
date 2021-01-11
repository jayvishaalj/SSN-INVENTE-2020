module.exports.authHeadUser = (req, res, next) => {
  console.log("SUPER USER SESSION : ", req.session);
  if (
    req.session &&
    req.session.isHeadUser &&
    req.session.isHeadUserLogged &&
    req.session.headUserData
  ) {
    next();
  } else {
    return res.redirect("/");
  }
};

module.exports.authHeadUserCheck = (req, res, next) => {
  console.log("SUPER USER SESSION : ", req.session);
  if (req.session && req.session.isHeadUser && req.session.headUserData) {
    return res.redirect("/event/head/home");
  } else {
    next();
  }
};
