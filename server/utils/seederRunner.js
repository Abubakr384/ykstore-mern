const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Order = require('../models/Order');
const Cart = require('../models/Cart');

const seedDataRunner = async () => {
  try {
    console.log('[Seeder] Cleaning existing database collections...');
    await User.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await Order.deleteMany();
    await Cart.deleteMany();

    console.log('[Seeder] Inserting Users...');
    const users = await User.create([
      {
        name: 'System Admin (Yousaf)',
        email: 'admin@ykstore.com',
        password: 'adminpassword123',
        role: 'admin',
        address: { street: '100 Main St', city: 'Karachi', postalCode: '75500', country: 'Pakistan' },
        phone: '+92 300 1234567'
      },
      {
        name: 'John Doe',
        email: 'user@ykstore.com',
        password: 'userpassword123',
        role: 'customer',
        address: { street: '45 Blue Ave', city: 'Lahore', postalCode: '54000', country: 'Pakistan' },
        phone: '+92 321 9876543'
      }
    ]);

    const customerUser = users[1]._id;

    console.log('[Seeder] Inserting Categories...');
    const categories = await Category.create([
      {
        name: 'Electronics & Tech',
        slug: 'electronics-tech',
        description: 'Smartphones, noise-canceling headphones, smart wearables & accessories.',
        image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop&q=80'
      },
      {
        name: 'Luxury Apparel',
        slug: 'luxury-apparel',
        description: 'High-end jackets, designer street attire, suits and premium shoes.',
        image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&auto=format&fit=crop&q=80'
      },
      {
        name: 'Home & Living',
        slug: 'home-living',
        description: 'Minimalist furniture, cozy ambient lighting, and elegant home decor.',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80'
      },
      {
        name: 'Watches & Jewelry',
        slug: 'watches-jewelry',
        description: 'Automatic chronographs, luxury timepieces and fine accessories.',
        image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80'
      }
    ]);

    console.log('[Seeder] Inserting Products...');
    const products = await Product.create([
      {
        name: 'Aura Sound Pro Wireless Headphones',
        description: 'Experience pure studio audio with active noise cancellation, 40-hour battery life, ergonomic memory foam ear cushions, and spatial sound support.',
        price: 249,
        originalPrice: 299,
        category: categories[0]._id,
        stock: 35,
        images: [
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop&q=80'
        ],
        rating: 4.9,
        numReviews: 48,
        isFeatured: true,
        tags: ['headphones', 'audio', 'wireless']
      },
      {
        name: 'Vortex Smart Watch Series 7',
        description: 'Titanium case smart watch with AMOLED display, continuous heart-rate monitoring, dual-band GPS, and 100m water resistance.',
        price: 389,
        originalPrice: 429,
        category: categories[0]._id,
        stock: 20,
        images: [
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80'
        ],
        rating: 4.8,
        numReviews: 32,
        isFeatured: true,
        tags: ['watch', 'tech', 'wearable']
      },
      {
        name: 'Minimalist Leather Urban Backpack',
        description: 'Crafted from full-grain Italian leather with dedicated 16-inch laptop compartment, water-resistant zippers, and hidden theft-proof passport pocket.',
        price: 179,
        originalPrice: 220,
        category: categories[1]._id,
        stock: 15,
        images: [
          'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&auto=format&fit=crop&q=80'
        ],
        rating: 4.7,
        numReviews: 19,
        isFeatured: true,
        tags: ['backpack', 'leather', 'accessories']
      },
      {
        name: 'Monochrome Designer Denim Jacket',
        description: 'Heavyweight organic cotton denim featuring raw indigo wash, branded metal hardware, and relaxed modern streetwear silhouette.',
        price: 129,
        originalPrice: 159,
        category: categories[1]._id,
        stock: 25,
        images: [
          'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80'
        ],
        rating: 4.6,
        numReviews: 14,
        isFeatured: false,
        tags: ['fashion', 'jacket', 'denim']
      },
      {
        name: 'Nordic Sculptural Desk Lamp',
        description: 'Modern dimmable LED desk lamp crafted from solid matte aluminium with touch-sensitive brightness control and warm natural eye care temperature.',
        price: 89,
        originalPrice: 110,
        category: categories[2]._id,
        stock: 40,
        images: [
          'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80'
        ],
        rating: 4.9,
        numReviews: 27,
        isFeatured: true,
        tags: ['home', 'lighting', 'decor']
      },
      {
        name: 'Chronos Heritage Automatic Watch',
        description: 'Precision Japanese automatic movement, sapphire crystal scratch-resistant glass, genuine leather strap, and 50m water resistance.',
        price: 499,
        originalPrice: 599,
        category: categories[3]._id,
        stock: 8,
        images: [
          'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80'
        ],
        rating: 5.0,
        numReviews: 41,
        isFeatured: true,
        tags: ['luxury', 'watch', 'jewelery']
      }
    ]);

    console.log('[Seeder] Creating sample customer order...');
    await Order.create({
      user: customerUser,
      orderItems: [
        {
          product: products[0]._id,
          name: products[0].name,
          quantity: 1,
          price: products[0].price,
          image: products[0].images[0]
        }
      ],
      shippingAddress: {
        fullName: 'John Doe',
        phone: '+92 321 9876543',
        street: '45 Blue Ave',
        city: 'Lahore',
        postalCode: '54000',
        country: 'Pakistan'
      },
      paymentMethod: 'COD',
      itemsPrice: products[0].price,
      shippingPrice: 15,
      totalPrice: products[0].price + 15,
      isPaid: false,
      status: 'Processing'
    });

    console.log('[Seeder] Data Seeded Successfully!');
    console.log('--------------------------------------------------');
    console.log('Admin Account:    admin@ykstore.com / adminpassword123');
    console.log('Customer Account: user@ykstore.com  / userpassword123');
    console.log('--------------------------------------------------');
  } catch (error) {
    console.error(`[Seeder Error] ${error.message}`);
  }
};

module.exports = seedDataRunner;
