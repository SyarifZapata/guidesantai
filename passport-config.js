const passport = require('passport')
  , LocalStrategy = require('passport-local');
const model = require('./server/routes/model');
const authHelpers = require('./server/routes/_helper');

passport.use('local', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
  },
  (username, password, done) => {
    model.User.findOne({
        where: {
        email: username
        }
    }).then((user) =>{
      if (!user) { return done(null, false); }
      if (!authHelpers.comparePass(password, user.password)) { return done(null, false); }
      return done(null, user);
    })
      .catch((err) =>{
        console.log(err.message);
        //wir haben noch error hier
        return done(err)
      })
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.userID);
});

passport.deserializeUser((id, done) => {
  model.User.findOne({
    where: {
      userID:id
    }
  }).then((user) => {
    console.log(user);
    done(null,user)
  }).catch((err) =>{
    console.log(err.message)
  })
});
