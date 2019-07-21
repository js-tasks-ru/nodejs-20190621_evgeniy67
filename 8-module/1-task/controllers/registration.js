const uuid = require('uuid/v4');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
  const {email, displayName, password} = ctx.request.body;
  const token = uuid();

  const u = new User({email, displayName, password, verificationToken: token});
  await await u.setPassword(password);
  await u.save().then((item) => {
    return sendMail({
      to: item.email,
      template: 'confirmation',
      subject: 'Подверждение регистрации',
      locals: {token},
    });
  }).then((item) => {
    ctx.body = {
      status: 'ok',
    };
  }).catch(async (err) => {
    if (!err.errors) {
      await u.delete();
      throw err;
    }

    ctx.status = 400;
    ctx.body = {errors: {}};

    for (const key in err.errors) {
      ctx.body.errors[key] = err.errors[key].message;
    }
  });

  next();
};

module.exports.confirm = async (ctx, next) => {
  const {verificationToken} = ctx.request.body;

  await User.findOne({verificationToken}).then(item => {
    item.verificationToken = undefined;
    return item.save();
  }).then(item => {
    ctx.body = {token: verificationToken};
  }).catch(err => {
    ctx.body = {error: 'Ссылка подтверждения недействительна или устарела'};
  });

  next();
};
