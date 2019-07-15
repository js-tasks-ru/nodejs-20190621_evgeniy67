const mongoose = require('mongoose');
const random = require('lodash/random');
const Category = require('./models/Category');
const Product = require('./models/Product');

const numberCategories = random(5, 10);
const numberProducts = random(50, 80);

(async function() {
  for (let i = 0; i < numberCategories; i++) {
    const numberSubcategory = random(1, 5);

    await Category.create({
      title: `Category ${i + 1}`,
      subcategories: new Array(numberSubcategory).fill().map((item, i) => ({
        title: `Subcategory ${i + 1}`,
      })),
    });
  }

  for (let i = 0; i < numberProducts; i++) {
    const numberCategory = random(1, numberCategories);
    const category = await Category.findOne({title: `Category ${numberCategory}`});
    const numberSubcategory = random(1, category.subcategories.length);

    await Product.create({
      images: new Array(random(1, 6)).fill().map((item, i) => `image${i + 1}`),
      title: `Product ${i + 1}`,
      description: 'Универсальная модель, которая с легкостью заменит родителям сразу ...',
      price: random(150, 100000),
      category: category._id,
      subcategory: category.subcategories.find(
        item => item.title === `Subcategory ${numberSubcategory}`
      )._id,
    });
  }
})().catch(console.error).then(() => mongoose.disconnect());
