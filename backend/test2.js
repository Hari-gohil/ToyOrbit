const mongoose = require('mongoose');
const User = require('./src/models/User');
const Order = require('./src/models/Order');

mongoose.connect('mongodb://localhost:27017/toy-shop').then(async () => {
  const users = await User.aggregate([
    {
      $lookup: {
        from: 'orders',
        localField: '_id',
        foreignField: 'user',
        as: 'orders'
      }
    },
    {
      $project: {
        name: 1,
        orderCount: { $size: '$orders' },
        totalSpent: { $sum: '$orders.totalAmount' }
      }
    }
  ]);
  console.log(JSON.stringify(users, null, 2));
  process.exit();
});
