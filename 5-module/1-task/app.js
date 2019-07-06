const Koa = require('koa');
const Chat = require('./Chat');

const app = new Koa();
const chat = new Chat();

app.use(require('koa-static')('public'));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

router.get('/subscribe', async (ctx, next) => {
  let resolveWaiting = null;
  const waiting = new Promise((resolve) => {
    resolveWaiting = resolve;
  });

  chat.once('change', (message) => {
    resolveWaiting(message);
  });

  const message = await waiting;

  ctx.status = 200;
  ctx.body = message;

  return next();
});

router.post('/publish', async (ctx, next) => {
  if (ctx.request.body.message) {
    chat.add(ctx.request.body.message);
    ctx.status = 200;
    ctx.body = 'Message added';
  }

  return next();
});

app.use(router.routes());

module.exports = app;
