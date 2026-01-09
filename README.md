# 🛒 Apex - Premium Multi-Vendor Marketplace

A modern, high-performance, full-stack multi-vendor e-commerce platform built with the MERN stack and enhanced with premium animations.

## ✨ Brand Identity: Apex
Apex represents the peak of quality and style. Formerly known as LuxeMarket, the platform has been completely modernized with:
- **Premium Aesthetics**: High-contrast design, custom typography (Outfit & Inter), and sleek dark-mode elements.
- **Modern Animations**: Powered by `framer-motion` for smooth, professional entrance reveals, staggered grids, and tactile button feedback.
- **Enhanced UX**: Integrated `react-hot-toast` for real-time notifications and professional feedback loops.

## 🚀 Tech Stack

### Frontend
- **React.js** (v19) - Modern UI Library
- **Framer Motion** - Premium animations and transitions
- **TailwindCSS** - Utility-first styling with custom theme
- **React Helmet Async** - Dynamic SEO management
- **React Hot Toast** - Elegant global notifications
- **Lucide Icons / React Icons** - Modern iconography

### Backend
- **Node.js & Express.js** - Robust server-side runtime
- **MongoDB & Mongoose** - Scalable NoSQL database
- **JWT & BcryptJS** - Secure authentication and encryption
- **Cloudinary** - Cloud-based image management

## 👥 User Roles
1. **Admin** - Platform management, vendor oversight, and global analytics.
2. **Vendor** - Specialized dashboard for product CRUD, order fulfillment, and sales tracking.
3. **Customer** - Premium shopping experience with curated collections and easy checkout.

## 📂 Project Structure
```
Apex/
├── client/                 # React Frontend (v19)
│   ├── public/             # Static assets & manifest
│   └── src/
│       ├── components/     # Atomic UI components
│       ├── pages/          # Page-level containers
│       ├── context/        # Auth & Cart state
│       └── utils/          # API & formatting helpers
└── server/                 # Express Backend
    ├── src/
    │   ├── controllers/    # Business logic
    │   ├── routes/         # API endpoints
    │   ├── models/         # Database schemas
    │   └── middlewares/    # Auth & validation
    └── server.js           # Entry point
```

## 🛠️ Local Development

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- Cloudinary Account (for image uploads)

### Setup Instructions
1. **Clone & Install**:
   ```bash
   # Install backend dependencies
   cd server && npm install
   
   # Install frontend dependencies
   cd ../client && npm install
   ```

2. **Environment Configuration**:
   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_name
   CLOUDINARY_API_KEY=your_key
   CLOUDINARY_API_SECRET=your_secret
   ```

3. **Run Application**:
   ```bash
   # Start Backend (from /server)
   npm run dev
   
   # Start Frontend (from /client)
   npm start
   ```

## 🚀 Deployment

### Unified Deployment (Vercel)
This project is configured for a unified deployment on Vercel using the root `vercel.json`. 

1. **Connect to GitHub**: Link your repository to Vercel.
2. **Environment Variables**: Add the following variables in the Vercel dashboard:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `REACT_APP_API_URL` (Optional, defaults to `/api` in production)
3. **Deploy**: Vercel will automatically detect the configuration and deploy both the frontend and the serverless backend functions.

### Manual Configuration
- **Build Command**: `npm run build` (inside `client/`)
- **Output Directory**: `client/build`
- **Root Directory**: Project root (`/`)

## 📝 License
MIT License - 2026 Apex Marketplace.
