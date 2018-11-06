const passport = require('passport')
  , LocalStrategy = require('passport-local')
  , FacebookStrategy = require('passport-facebook').Strategy;
const User = require('./models/user');
const FacebookUser = require('./models/facebookUser');
const bcrypt = require('bcrypt');
require('dotenv').config();

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
        console.log(err);
        return done(err);
    })
  }
));

passport.use('facebook',new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/callback",
    profileFields: ['id','displayName','picture']
  },
  (accessToken, refreshToken, profile, done) => {
    // two cases
    // #1 firsttime login => create new FacebookUser
    // #2 other times
    FacebookUser.findOne({where:{facebook_id:profile.id}}).then((user) =>{
      if(user !== null) {return done(null,user)}
      FacebookUser.create({
        facebook_id: profile.id,
        username: profile.displayName
      }).then((newUser) => {
        done(null,newUser)
      })
    }).catch((err) => {
      console.log(err);
      done(err);
    });

  }
));

passport.serializeUser(function(user, done) {
  if(user.login_strategy === 'local'){
    done(null, user.user_id);
  }else if(user.login_strategy === 'facebook'){
    done(null, user.facebook_id)
  }else{
    console.log('Unknown Strategy');
  }

});

/* For the deserialize, we use Promise.race. It will return as soon as a function is returned */
//TODO: find way to handel this. better using chaining promise.
//TODO still errror, find the error hier
passport.deserializeUser((id, done) => {
  User.findOne({where:{user_id:id}}).then((user)=>{
    if(user === null) return FacebookUser.findOne({where:{facebook_id: id}});
    // we forwarded the result to the next then()
    // not null, this method only get called if local strategy is used.
    return user.get()
  }).then((fbUser) => {
    if(fbUser === null) throw 'User not found';
    done(null,fbUser)
  }).catch((err) => {
    console.log(err);
    done(err)
  });
});
