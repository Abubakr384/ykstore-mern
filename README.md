# 🛍️ YKStore (Yousaf Kana Store) — Full-Stack MERN E-Commerce Platform

![YKStore Banner](https://images.unsplash.com/photo-1557821552-17105176677c?w=1200&auto=format&fit=crop&q=80)

> A modern, full-featured, full-stack MERN (MongoDB, Express.js, React.js, Node.js) E-Commerce Web Application built for the **6-Week Developer Internship Program**.

---

## 🎯 Project Objectives & Overview

YKStore is designed to deliver a high-performance shopping experience for customers and a control panel for store administrators. It features:
- **Cloud Database:** Real-time data persistence with MongoDB Atlas.
- **Security:** JWT (JSON Web Tokens) with role-based access control (`customer` vs `admin`) and `bcryptjs` password encryption.
- **Storefront:** Full product catalog with real-time search, category filtering, price sorting, rating filters, animated floating toasts, wishlist management, and customer reviews.
- **Admin Control Panel:** Business analytics dashboard, full CRUD operations for Products, Categories, Orders, and Users.

---

## 🚀 Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Lucide React Icons, React Router v6, Axios.
- **Backend:** Node.js, Express.js, JWT Authentication, Bcrypt.js, Express Async Handler, Multer File Uploads.
- **Database:** MongoDB Atlas (Cloud Database), Mongoose ODM.
- **Deployment:** Render (Backend API), Vercel (React Frontend), MongoDB Atlas (Database).

---

## 📋 6-Week Internship Curriculum Completion Table

| Week | Focus Area | Status | Key Deliverables Completed |
| :--- | :--- | :---: | :--- |
| **Week 1** | Project Setup & Backend Auth | ✅ **Done** | Express Server, MongoDB Atlas Connection, User Schema, Register/Login APIs, Bcrypt & JWT. |
| **Week 2** | Core Backend APIs | ✅ **Done** | Product, Category, Cart, Order CRUD APIs with Role-Based Middleware. |
| **Week 3** | Frontend Foundation & Storefront | ✅ **Done** | React + Vite Setup, Tailwind CSS Layouts, Product Listing, Search & Category Filters, Details Page. |
| **Week 4** | Auth, Cart & Checkout Frontend | ✅ **Done** | Login & Register pages, AuthContext, Protected Routes, Cart State Sync, Checkout UI with COD. |
| **Week 5** | Payments, Order History & Admin Panel | ✅ **Done** | 'My Orders' Tracking, Admin Dashboard Analytics, Product/Category/Order/User Management. |
| **Week 6** | Polish, Extras & Deployment | ✅ **Done** | Wishlist System, Direct File Uploads, Animated Toasts, Product Reviews, Atlas DB & Deployment Docs. |

---

## ✨ Features Breakdown

### 🛒 Customer Storefront
- 🔍 **Real-Time Search & Filters:** Filter by keyword, category, price sorting, and minimum rating.
- ❤️ **Wishlist / Favorites System:** Toggle favorites with 1-click and view saved items on `/wishlist`.
- 🛍️ **Cart & Checkout:** Dynamic subtotal calculation, quantity adjustment, and Cash on Delivery (COD) / Card checkout.
- ⭐ **Customer Reviews:** Verified buyers can leave star ratings and feedback.
- 📦 **Order Tracking:** Track past orders and real-time order status updates.

### 👑 Admin Control Panel
- 📊 **Business Dashboard:** Revenue metrics, Total Sales, Total Orders, Products, and Registered Users.
- 📸 **Direct Image Uploads:** Drag-and-drop or select local image files from PC with instant preview.
- 📦 **Order Management:** Update order status (`Pending` ➔ `Processing` ➔ `Shipped` ➔ `Delivered`).
- 👥 **User Management:** View all accounts and toggle user roles (`customer` ⟷ `admin`).

---

## ⚙️ Local Installation & Running Guide

### Quick 1-Click Launch (Windows Batch Script)
Double-click **`run.bat`** in the root project folder:
- **Frontend App:** http://localhost:3000
- **Backend API:** http://localhost:5000

### Manual Setup Commands

#### 1. Clone & Install Dependencies
```bash
# Clone the repository
git clone https://github.com/your-username/ykstore-mern.git
cd ykstore-mern

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

#### 2. Environment Variables (.env)
Create a `.env` file inside `/server` directory:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://admin:adminpassword123@cluster0.olixblt.mongodb.net/ykstore?retryWrites=true&w=majority
JWT_SECRET=ykstore_super_secret_jwt_key_2026_safe
```

#### 3. Seed Initial Database
```bash
cd server
npm run seed
```

#### 4. Run Development Servers
```bash
# Terminal 1 (Backend)
cd server
npm run dev

# Terminal 2 (Frontend)
cd client
npm run dev
```

---

## 🔐 Pre-Seeded Demo Credentials

- 👑 **System Admin:** `admin@ykstore.com` | Password: `adminpassword123`
- 👤 **Demo Customer:** `user@ykstore.com` | Password: `userpassword123`

---

## 🌐 Production Deployment Guide

### 1. Backend (Render.com)
1. Create a new **Web Service** on Render connected to your GitHub repo.
2. Root Directory: `server`
3. Build Command: `npm install`
4. Start Command: `node server.js`
5. Add Environment Variables (`MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`).

### 2. Frontend (Vercel)
1. Import repository on Vercel.
2. Root Directory: `client`
3. Framework Preset: `Vite`
4. Build Command: `npm run build`
5. Deploy!

---

## 📄 License & Author
Developed as part of the 6-Week MERN Stack Development Training Program.
