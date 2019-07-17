const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');

module.exports = new LocalStrategy(
    {usernameField: 'email', passwordField: 'password', session: false},
    async function(email, password, done) {
      const user = await User.findOne({email});

      if (!user) {
        done(null, false, 'Нет такого пользователя');
      } else if (!await user.checkPassword(password).then((value) => value)) {
        done(null, false, 'Невереный пароль');
      } else {
        done(null, user);
      }
    }
);
