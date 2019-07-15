const Product = require('../models/Product');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  if (!ctx.query.subcategory) {
    return next();
  }

  const products = await Product.find({ subcategory: ctx.query.subcategory }).catch(() => []);

  ctx.body = {products};
  next();
};

module.exports.productList = async function productList(ctx, next) {
  const products = await Product.find();

  ctx.body = {products};
  next();
};

module.exports.productById = async function productById(ctx, next) {
  await Product.findById(ctx.params.id).then(item => {
    if (item) {
      ctx.body = {product: item};
    } else {
      ctx.status = 404;
    }
  }).catch((err) => {
    ctx.status = 400;
  });

  next();
};

