const passport = require('passport')
  , LocalStrategy = require('passport-local');
const User = require('./models/user');
const bcrypt = require('bcrypt');

/* We write this code exactly like in the example found on the internet
   be careful when using bcrypt.compare it is an asynchronous function.
 */

passport.use('local', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
  },
  (username, password, done) => {
    let getUserByUsername = User.findOne({where:{username: username}});
    let getUserByEmail = User.findOne({where:{email: username}});

    getUserByEmail.then((user) => {
      if(user !== null){
        return user.get();
      }else {
        return getUserByUsername;
      }
    }).then((user)=>{
      if(user === null) return done(null, false);
      bcrypt.compare(password, user.password, function(err, res) {
        if(res) {
          done(null, user)
        } else {
          done(null, false)
        }
      })
    }).catch((err) =>{
        console.log(err.message);
        return done(err);
    })

    // User.findOne({
    //     where: {
    //     email: username
    //     }
    // }).then((user) =>{
    //   if (!user) { return done(null, false); }
    //   bcrypt.compare(password, user.password, function(err, res) {
    //     if(res) {
    //       done(null, user)
    //     } else {
    //       done(null, false)
    //     }
    //   })
    // })
    //   .catch((error) =>{
    //     console.log(error.message);
    //     return done(error)
    //   })
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.userID);
});

passport.deserializeUser((id, done) => {
  User.findOne({
    where: {
      userID:id
    }
  }).then((user) => {
    done(null,user)
  }).catch((err) =>{
    console.log(err.message)
  })
});
