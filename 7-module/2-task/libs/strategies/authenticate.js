const User = require('../../models/User');

module.exports = async function authenticate(strategy, email, displayName, done) {
  if (!email) return done(false, false, 'Не указан email');

  const user = await User.findOne({email});

  if (user) {
    return done(null, user);
  }

  const u = await new User({email, displayName});
  await u.save().catch(async (err) => {
    await u.delete();
    done(err, false, 'Некорректный email.');
  });

  return done(null, u);
};
