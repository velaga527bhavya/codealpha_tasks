/* const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Initialize app
const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/easyshop', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Error connecting to MongoDB:', err));

// Define product schema and model
const productSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: Number,
  discount: Number,
  sizes: [String],
});
const Product = mongoose.model('Product', productSchema);

// Sample product data
const productsData = {
  men: [
    { name: 'Men\'s T-Shirt', price: 20, discount: 10, sizes: ['S', 'M', 'L', 'XL'] },
    { name: 'Men\'s Jeans', price: 40, discount: 15, sizes: ['28', '30', '32', '34'] },
    // Add 8 more sample men products here
  ],
  women: [
    { name: 'Women\'s Dress', price: 50, discount: 20, sizes: ['S', 'M', 'L'] },
    { name: 'Women\'s Skirt', price: 30, discount: 5, sizes: ['M', 'L', 'XL'] },
    // Add 8 more sample women products here
  ],
  kids: [
    { name: 'Kids\' T-Shirt', price: 15, discount: 5, sizes: ['S', 'M'] },
    { name: 'Kids\' Jeans', price: 25, discount: 10, sizes: ['S', 'M', 'L'] },
    // Add 8 more sample kids products here
  ],
  latest: [
    { name: 'Latest Fashion Jacket', price: 80, discount: 30, sizes: ['M', 'L', 'XL'] },
    { name: 'New Arrival Shoes', price: 60, discount: 20, sizes: ['8', '9', '10'] },
    // Add 8 more latest products here
  ]
};

// Seed products into the database
const seedProducts = async () => {
    try {
      // Loop through each category (men, women, kids, latest)
      for (let category in productsData) {
        // Loop through each product in that category
        for (let product of productsData[category]) {
          const newProduct = new Product(product);
          await newProduct.save(); // Save the product to the database
        }
      }
      console.log("Products seeded successfully!");
    } catch (error) {
      console.error("Error seeding products:", error);
    }
  };
  

// Uncomment this line to seed products on initial run
seedProducts();

// Routes
app.get('/api/products/:category', async (req, res) => {
  const category = req.params.category;
  const products = await Product.find({ category });
  res.json(products);
});

app.get('/api/product/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.json(product);
});

app.post('/api/orders', (req, res) => {
  console.log('Order received:', req.body);
  res.json({ message: 'Order placed successfully!' });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); */


/*

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/easyshop', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Error connecting to MongoDB:', err));

// Define product schema and model
const productSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: Number,
  discount: Number,
  sizes: [String],
  image: String
});
const Product = mongoose.model('Product', productSchema);

// Sample product data
const productsData = {
  men: [
    { name: "Men T-Shirt", price: 20, discount: 10, sizes: ['S', 'M', 'L', 'XL'], image: "https://images.pexels.com/photos/878358/pexels-photo-878358.jpeg?auto=compress&cs=tinysrgb&w=600" },
    { name: "Men Jeans", price: 40, discount: 15, sizes: ['28', '30', '32', '34'], image: "https://images.pexels.com/photos/1306248/pexels-photo-1306248.jpeg?auto=compress&cs=tinysrgb&w=600" },
    { name: "Men Jacket", price: 60, discount: 20, sizes: ['M', 'L', 'XL'], image: "https://images.pexels.com/photos/1342609/pexels-photo-1342609.jpeg?auto=compress&cs=tinysrgb&w=600" },
    { name: "Men Shorts", price: 25, discount: 5, sizes: ['S', 'M', 'L'], image: "https://th.bing.com/th/id/OIP.DBsBkvDElZsZfcUfcHrFdQAAAA?rs=1&pid=ImgDetMain" },
    { name: "Men Sneakers", price: 50, discount: 10, sizes: ['7', '8', '9', '10'], image: "https://th.bing.com/th/id/OIP.Z57_OYu0irWCNa3jmb3kkQHaEo?w=289&h=180&c=7&r=0&o=5&pid=1.7" },
    { name: "Men Hoodie", price: 45, discount: 12, sizes: ['S', 'M', 'L', 'XL'], image: "https://th.bing.com/th/id/OIP.he3aoE5axA0zo67e2lbYNwHaHa?w=206&h=205&c=7&r=0&o=5&pid=1.7" },
    { name: "Men Watch", price: 100, discount: 25, sizes: [], image: "https://th.bing.com/th/id/OIP.jXl-WYK0ZimIe8xgaLTcEgHaFN?w=262&h=183&c=7&r=0&o=5&pid=1.7" },
    { name: "Men Sunglasses", price: 30, discount: 8, sizes: [], image: "https://th.bing.com/th/id/OIP.T1UyYxvvJFyOYeJwbS20NAHaEG?w=332&h=183&c=7&r=0&o=5&pid=1.7" },
    { name: "Men Belt", price: 20, discount: 5, sizes: [], image: "https://th.bing.com/th/id/OIP.CRUfkM9MhztUHz_Gc1kAAgAAAA?w=227&h=220&c=7&r=0&o=5&pid=1.7" },
    { name: "Men Cap", price: 15, discount: 3, sizes: [], image: "https://th.bing.com/th/id/OIP.NKBumkEb2n2RJU3x4FA7RQHaHa?pid=ImgDet&w=191&h=191&c=7" }
  ],
  women: [
    { name: "Womens Dress", price: 50, discount: 20, sizes: ['S', 'M', 'L'], image: "https://th.bing.com/th/id/OIP.CqnmXlI_NNWdsGLDdhHypgAAAA?w=184&h=250&c=7&r=0&o=5&pid=1.7" },
    { name: "Womens Skirt", price: 30, discount: 5, sizes: ['M', 'L', 'XL'], image: "https://th.bing.com/th/id/OIP.suYdeZ7ZUylHp4wf4OqWeAAAAA?w=184&h=275&c=7&r=0&o=5&pid=1.7" },
    { name: "Womens Blouse", price: 35, discount: 10, sizes: ['S', 'M', 'L'], image: "https://th.bing.com/th/id/OIP.2vItQmQRlSnobtTwEoAdiAHaHa?w=184&h=184&c=7&r=0&o=5&pid=1.7" },
    { name: "Womens Heels", price: 60, discount: 15, sizes: ['6', '7', '8'], image: "https://th.bing.com/th/id/OIP.e8NIxwetc-JT5XptEjRKjAHaG0?w=202&h=186&c=7&r=0&o=5&pid=1.7" },
    { name: "Womens Handbag", price: 80, discount: 25, sizes: [], image: "https://th.bing.com/th/id/OIP.PAY5MdPKRkeNe2Bq7tzLtQHaHa?w=192&h=192&c=7&r=0&o=5&pid=1.7" },
    { name: "Womens Perfume", price: 55, discount: 12, sizes: [], image: "https://th.bing.com/th/id/OIP.L-MjYAqQLsKvRp1jYfB68wHaHa?w=182&h=182&c=7&r=0&o=5&pid=1.7" },
    { name: "Womens Earrings", price: 20, discount: 5, sizes: [], image: "https://th.bing.com/th/id/OIP.YfSnHt4rUIII1BWiofF_xwHaHa?w=190&h=190&c=7&r=0&o=5&pid=1.7" },
    { name: "Womens Sunglasses", price: 35, discount: 8, sizes: [], image: "https://th.bing.com/th/id/OIP._ksxaUUHuuLaL8bb4l446gAAAA?rs=1&pid=ImgDetMain" },
    { name: "Womens Watch", price: 90, discount: 18, sizes: [], image: "https://th.bing.com/th/id/OIP.RnTEadptCtHV6KR4rSkW1gHaHa?w=213&h=213&c=7&r=0&o=5&pid=1.7" },
    { name: "Womens Jeans", price: 45, discount: 10, sizes: ['26', '28', '30', '32'], image: "https://th.bing.com/th/id/OIP.Kcle1oGU_Vr5rxQvAYbFrQHaKl?w=184&h=262&c=7&r=0&o=5&pid=1.7" }
  ],
  kids: [
    { name: "Kids T-Shirt", price: 15, discount: 5, sizes: ['S', 'M'], image: "https://th.bing.com/th/id/OIP.HwKnZx7UDpnbzga3oyYxqwHaHa?w=187&h=187&c=7&r=0&o=5&pid=1.7" },
    { name: "Kids Jeans", price: 25, discount: 10, sizes: ['S', 'M', 'L'], image: "https://th.bing.com/th/id/OIP.BzEOgYdzTZTi6Uf3dUE-pQHaHa?rs=1&pid=ImgDetMain" },
    { name: "Kids Sneakers", price: 30, discount: 8, sizes: ['5', '6', '7'], image: "https://th.bing.com/th/id/OIP.BS9LGFaTUl2lIuB2rysnrQHaHa?w=189&h=189&c=7&r=0&o=5&pid=1.7" },
    { name: "Kids Dress", price: 35, discount: 12, sizes: ['S', 'M', 'L'], image: "https://th.bing.com/th/id/OIP.oAF14_4iIQ4R_5S9zeV_JQHaHa?w=200&h=200&c=7&r=0&o=5&pid=1.7" },
    { name: "Kids Cap", price: 10, discount: 3, sizes: [], image: "https://th.bing.com/th/id/OIP.q3k-XA_Z759fqLgnwbPtiAHaHa?w=214&h=215&c=7&r=0&o=5&pid=1.7" },
    { name: "Kids Backpack", price: 40, discount: 10, sizes: [], image: "https://th.bing.com/th/id/OIP.WZwPOvIt-rg8dNDqxEizngHaHa?w=198&h=198&c=7&r=0&o=5&pid=1.7" },
    { name: "Kids Toy Set", price: 50, discount: 15, sizes: [], image: "https://th.bing.com/th/id/OIP.PB06AbjtHKWxS4mX2_AxKwHaHa?w=212&h=212&c=7&r=0&o=5&pid=1.7" },
    { name: "Kids Jacket", price: 45, discount: 10, sizes: ['S', 'M', 'L'], image: "https://th.bing.com/th/id/OIP.IJZGDwUAkHdxrzIkJ57h-gHaJ3?rs=1&pid=ImgDetMain" },
    { name: "Kids Sunglasses", price: 20, discount: 5, sizes: [], image: "https://th.bing.com/th/id/OIP.2VtPOp2J0shyz3BIUfH3gwHaHa?rs=1&pid=ImgDetMain" },
    { name: "Kids Watch", price: 35, discount: 7, sizes: [], image: "https://th.bing.com/th/id/OIP.YwrhgDeWjsPnwdvAZWsxDwHaE8?w=268&h=180&c=7&r=0&o=5&pid=1.7" }
  ]
};


// Seed products into the database
const seedProducts = async () => {
    try {
      await Product.deleteMany({}); 
      for (let category in productsData) {
        for (let product of productsData[category]) {
          const newProduct = new Product({ ...product, category });
          await newProduct.save();

        }
      }
      console.log("Products seeded successfully!");
    } catch (error) {
      console.error("Error seeding products:", error);
    }
};

// Uncomment this line to seed products on initial run
seedProducts();

// Routes
app.get('/api/products/:category', async (req, res) => {
  try {
    const category = req.params.category;
    const products = await Product.find({ category });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching products' });
  }
});

app.get('/api/product/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Product not found' });
  }
});

// Define Order Schema and Model
const orderSchema = new mongoose.Schema({
  products: [
    {
      productId: mongoose.Schema.Types.ObjectId,
      name: String,
      price: Number,
      size: String
    }
  ],
  totalAmount: Number,
  date: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

// API Route to Store Orders
app.post('/api/orders', async (req, res) => {
  try {
    const { cart } = req.body;

    if (!cart || cart.length === 0) {
      return res.status(400).json({ message: 'Cart is empty!' });
    }

    const totalAmount = cart.reduce((sum, item) => sum + item.price, 0);

    // Create new order based on cart items
    const newOrder = new Order({
      products: cart,
      totalAmount
    });
    console.log('Order to be saved:', newOrder);
    // Save to the database
    await newOrder.save();

    // Return a response with order details
    res.json({ message: 'Order placed successfully!', orderId: newOrder._id });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cart feature
let cart = [];

app.post('/api/cart/add', (req, res) => {
  const { id, name, price, size } = req.body; // ✅ Added size
  cart.push({ id, name, price, size });
  res.json({ message: 'Item added to cart', cart });
});

app.get('/api/cart', (req, res) => {
  res.json(cart);
});

app.post('/api/cart/clear', (req, res) => {
  cart = [];
  res.json({ message: 'Cart cleared' });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
*/

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/easyshop', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Error connecting to MongoDB:', err));

// Define product schema and model
const productSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: Number,
  discount: Number,
  sizes: [String],
  image: String
});
const Product = mongoose.model('Product', productSchema);

// Sample product data (unchanged)
const productsData = {
  men: [
    { name: "Men T-Shirt", price: 20, discount: 10, sizes: ['S', 'M', 'L', 'XL'], image: "https://images.pexels.com/photos/878358/pexels-photo-878358.jpeg?auto=compress&cs=tinysrgb&w=600" },
    // ... (other men products)
  ],
  women: [
    { name: "Womens Dress", price: 50, discount: 20, sizes: ['S', 'M', 'L'], image: "https://th.bing.com/th/id/OIP.CqnmXlI_NNWdsGLDdhHypgAAAA?w=184&h=250&c=7&r=0&o=5&pid=1.7" },
    // ... (other women products)
  ],
  kids: [
    { name: "Kids T-Shirt", price: 15, discount: 5, sizes: ['S', 'M'], image: "https://th.bing.com/th/id/OIP.HwKnZx7UDpnbzga3oyYxqwHaHa?w=187&h=187&c=7&r=0&o=5&pid=1.7" },
    // ... (other kids products)
  ]
};

// Seed products into the database
const seedProducts = async () => {
  try {
    await Product.deleteMany({}); 
    for (let category in productsData) {
      for (let product of productsData[category]) {
        const newProduct = new Product({ ...product, category });
        await newProduct.save();
      }
    }
    console.log("Products seeded successfully!");
  } catch (error) {
    console.error("Error seeding products:", error);
  }
};

// Uncomment this line to seed products on initial run
//seedProducts();

// Routes for products
app.get('/api/products/:category', async (req, res) => {
  try {
    const category = req.params.category;
    const products = await Product.find({ category });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching products' });
  }
});

app.get('/api/product/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Product not found' });
  }
});

// ----------------------
// UPDATED: Order Schema & Order Endpoint
// ----------------------

// Extend the Order Schema to include user details
const orderSchema = new mongoose.Schema({
  products: [
    {
      productId: mongoose.Schema.Types.ObjectId,
      name: String,
      price: Number,
      size: String
    }
  ],
  totalAmount: Number,
  user: {  // New field for user details
    name: String,
    phone: String,
    address: String
  },
  date: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

// API Route to Store Orders (now accepts user details)
app.post('/api/orders', async (req, res) => {
  try {
    const { cart, user } = req.body;

    if (!cart || cart.length === 0) {
      return res.status(400).json({ message: 'Cart is empty!' });
    }

    const totalAmount = cart.reduce((sum, item) => sum + item.price, 0);

    // Create new order based on cart items and user details
    const newOrder = new Order({
      products: cart,
      totalAmount,
      user
    });
    console.log('Order to be saved:', newOrder);
    await newOrder.save();

    res.json({ message: 'Order placed successfully!', orderId: newOrder._id });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ----------------------
// (Unchanged) Cart Feature Endpoints
// ----------------------
let cart = [];

app.post('/api/cart/add', (req, res) => {
  const { id, name, price, size } = req.body; // ✅ Added size
  cart.push({ id, name, price, size });
  res.json({ message: 'Item added to cart', cart });
});

app.get('/api/cart', (req, res) => {
  res.json(cart);
});

app.post('/api/cart/clear', (req, res) => {
  cart = [];
  res.json({ message: 'Cart cleared' });
});

// ----------------------
// NEW: User Profile Endpoints
// ----------------------

// Define a simple User Profile schema and model
const userProfileSchema = new mongoose.Schema({
  name: String,
  phone: String,
  address: String
});
const UserProfile = mongoose.model('UserProfile', userProfileSchema);

// Endpoint to save/update the user profile
app.post('/api/profile', async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    // For simplicity, assume a single profile record
    let profile = await UserProfile.findOne();
    if (profile) {
      profile.name = name;
      profile.phone = phone;
      profile.address = address;
      await profile.save();
    } else {
      profile = new UserProfile({ name, phone, address });
      await profile.save();
    }
    res.json({ message: "Profile saved successfully!" });
  } catch (error) {
    console.error("Error saving profile:", error);
    res.status(500).json({ message: "Server error saving profile." });
  }
});

// Endpoint to retrieve the user profile
app.get('/api/profile', async (req, res) => {
  try {
    const profile = await UserProfile.findOne();
    res.json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error fetching profile." });
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


