const mongoose = require('mongoose');
const Category = require('./models/Category');
const Product = require('./models/Product');

(async function() {
  // await Category.create({
  //   title: 'Детские товары и игрушки',
  //   subcategories: [
  //     {
  //       title: 'Прогулки и детская комната',
  //     },
  //   ],
  // });

  const category = await Category.findOne({title: 'Детские товары и игрушки'});
  const subcategory = await category.populate('subcategories').find({title: 'Прогулки и детская комната'});
console.log(category);
console.log(subcategory);
  // await Product.create({
  //   images: ['test.png'],
  //   title: 'Коляска Adamex Barletta 2 in 1',
  //   description: 'Универсальная модель, которая с легкостью заменит родителям сразу ...',
  //   price: 21230,
  //   category: category._id,
  //   subcategory: subcategory._id,
  // });
})().catch(console.error).then(() => mongoose.disconnect());
