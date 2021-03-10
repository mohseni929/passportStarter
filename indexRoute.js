const express = require("express");
const router = express.Router();
const session = require("express-session");
const { ensureAuthenticated, isAdmin } = require("../middleware/checkAuth");

router.get("/", (req, res) => {
  res.send("welcome");
});

router.get("/dashboard", ensureAuthenticated, (req, res) => {
  res.render("dashboard", {
    user: req.user,
  });
});

router.get("/admin", ensureAuthenticated,(req, res) => {
  let user = req.user;
  if(user.role =="admin"){
  sessions = []
  for(var item in req.sessionStore.sessions)
  {
    sessions.push({key: item , value: JSON.parse(req.sessionStore.sessions[item])})
  }
  res.render("admin" , {
    sessions
  });
  }else{
  res.redirect("/dashboard");
}
});

router.get("/revoke/:sessionId", ensureAuthenticated,(req, res) => {
  sessionId = req.params.sessionId
  console.log(sessionId)
  req.sessionStore.destroy(req.params.sessionId, (err) => {
    if(err)
    {
      res.redirect("/")
    }else{
      res.redirect("/admin");
    }
  })


  for (var [key,value] of Object.entries(req.sessionStore["sessions"])) {
    value = JSON.parse(value)
    if (value["passport"]["user"] == sessionId) {
      delete req.sessionStore["sessions"][key]
    }
  }

});

module.exports = router;
