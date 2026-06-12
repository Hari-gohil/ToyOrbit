const mongoose = require('mongoose');
const User = require('./src/models/User');

const MONGO_URI = "mongodb+srv://gohilhari2006:gohilhari2006@cluster0.gvqogel.mongodb.net/ToyDB?appName=Cluster0";

mongoose.connect(MONGO_URI).then(async () => {
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
      $lookup: {
        from: 'reviews',
        localField: '_id',
        foreignField: 'user',
        as: 'reviews'
      }
    },
    {
      $project: {
        name: 1,
        orderCount: { $size: '$orders' },
        totalSpent: { $sum: '$orders.totalAmount' },
        reviewCount: { $size: '$reviews' }
      }
    }
  ]);
  console.log(JSON.stringify(users, null, 2));
  process.exit();
}).catch(err => {
  console.error(err);
  process.exit(1);
});
