# 🏠 Bangalore Bachelor Directory

> A platform for bachelors living in Bangalore to find PG accommodations, Tiffin Services, and Cooks — and list their own services too.

---

## 📌 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Architecture Diagram](#architecture-diagram)
- [Working Flow](#working-flow)
- [Features](#features)
- [Environment Variables](#environment-variables)
- [Installation & Setup](#installation--setup)
- [API Endpoints](#api-endpoints)

---

## 📖 Project Overview

**Bangalore Bachelor Directory** is a full-stack MERN web application that helps bachelors living in Bangalore to:

- Find PG (Paying Guest), Tiffin Services, and Cooks
- Add and manage their own listings
- Leave reviews and star ratings
- Contact owners directly via WhatsApp or Phone Call

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, React Router v6, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Authentication | JWT (JSON Web Token) |
| Image Upload | Cloudinary + Multer |
| Styling | Custom CSS |
| Icons | React Icons (Font Awesome) |
| Rate Limiting | express-rate-limit |

---

## 📁 Folder Structure

```
bangalore-bachelor-directory/
│
├── backend/
│   ├── middleware/
│   │   ├── auth.js            ← JWT token verification
│   │   └── upload.js          ← Cloudinary + Multer image upload
│   ├── models/
│   │   ├── Resource.js        ← Listing schema (PG/Tiffin/Cook)
│   │   └── User.js            ← User schema
│   ├── routes/
│   │   ├── auth.js            ← Register & Login routes
│   │   └── resources.js       ← CRUD + Reviews + Image upload
│   ├── .env                   ← Environment variables
│   ├── server.js              ← Express app entry point
│   └── package.json
│
├── frontend/
│   └── src/
│       ├── components/
│       │   └── ResourceCard.jsx        ← Listing card component
│       ├── context/
│       │   └── AuthContext.jsx         ← Global auth state
│       ├── pages/
│       │   ├── HomePage.jsx
│       │   ├── BrowsePage.jsx          ← Search + Filter listings
│       │   ├── ResourceDetailPage.jsx  ← Single listing + Reviews
│       │   ├── AddListingPage.jsx      ← Create new listing
│       │   ├── DashboardPage.jsx       ← Manage my listings
│       │   ├── LoginPage.jsx
│       │   └── SignupPage.jsx
│       ├── services/
│       │   └── api.js                  ← Axios API service
│       └── styles/                     ← CSS files for each page
│
└── README.md
```

---

## 🏗 Architecture Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                        USER (Browser)                         │
└───────────────────────┬──────────────────────────────────────┘
                        │  HTTP Request
                        ▼
┌──────────────────────────────────────────────────────────────┐
│                   FRONTEND (React App)                        │
│                     localhost:3000                            │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐  ┌──────────┐   │
│  │ HomePage │  │  Browse  │  │  Detail   │  │Dashboard │   │
│  └──────────┘  └──────────┘  └───────────┘  └──────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              AuthContext (Global State)               │   │
│  │         isAuthenticated | user | token                │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              api.js (Axios Instance)                  │   │
│  │      Bearer Token auto-attached via interceptor       │   │
│  └──────────────────────────────────────────────────────┘   │
└───────────────────────┬──────────────────────────────────────┘
                        │  REST API (JSON)
                        ▼
┌──────────────────────────────────────────────────────────────┐
│                   BACKEND (Express.js)                        │
│                     localhost:5000                            │
│                                                              │
│  ┌─────────────────┐   ┌──────────────────────────────────┐ │
│  │  /api/auth      │   │       /api/resources              │ │
│  │  POST /login    │   │  GET    /            (browse)     │ │
│  │  POST /register │   │  GET    /my-listings              │ │
│  │  GET  /profile  │   │  GET    /:id                      │ │
│  └─────────────────┘   │  POST   /            (create)     │ │
│                        │  PUT    /:id          (update)    │ │
│  ┌─────────────────┐   │  DELETE /:id          (delete)    │ │
│  │   Middleware    │   │  POST   /upload-image             │ │
│  │  auth.js (JWT)  │   │  POST   /:id/reviews              │ │
│  │  upload.js      │   │  DELETE /:id/reviews/:reviewId    │ │
│  │  rate-limit     │   └──────────────────────────────────┘ │
│  └─────────────────┘                                        │
└──────────┬──────────────────────────────┬────────────────────┘
           │                              │
           ▼                              ▼
┌──────────────────────┐     ┌───────────────────────┐
│    MongoDB Atlas      │     │   Cloudinary (CDN)    │
│                      │     │                       │
│  Collections:        │     │  - Image Storage      │
│  - users             │     │  - Auto resize        │
│  - resources         │     │    800x600            │
│  - reviews (embedded)│     │  - Quality: auto      │
└──────────────────────┘     └───────────────────────┘
```

---

## 🔄 Working Flow

### 1. User Registration / Login Flow

```
User fills Login / Register form
            │
            ▼
    LoginPage.jsx / SignupPage.jsx
            │
            │   POST /api/auth/login  OR  POST /api/auth/register
            │   Body: { email, password }
            ▼
    Backend auth route
            │
            │   Find user in MongoDB
            │   bcrypt.compare(password, hashedPassword)
            ▼
    Password matches?
            │
            ├── ✅ YES
            │         │
            │         │   Generate JWT Token (expires in 7d)
            │         │   Return { token, user }
            │         ▼
            │   Frontend saves token to localStorage
            │   AuthContext → isAuthenticated = true
            │   Redirect to Home
            │
            └── ❌ NO → 401 Unauthorized
```

---

### 2. Browse & Search Listings Flow

```
User visits /browse page
            │
            ▼
    BrowsePage.jsx loads
            │
            │   GET /api/resources
            │   Query params: ?type=pg&area=HSR Layout&page=1&limit=9
            ▼
    Backend applies filters to MongoDB query:
    { status: "active", type, area, priceRange, keyword }
    .sort({ featured: -1, createdAt: -1 })
    .skip((page-1) * limit).limit(9)
            │
            ▼
    Returns: { data, total, totalPages, currentPage }
            │
            ▼
    ResourceCard.jsx renders each listing
            │
            ├── WhatsApp button  →  wa.me/91XXXXXXXXXX
            │                       (pre-filled message)
            ├── Call button      →  tel:XXXXXXXXXX
            ├── Maps button      →  Google Maps link
            └── View Details     →  /resource/:id
```

---

### 3. Add Listing & Image Upload Flow

```
User fills AddListingPage form
            │
            ▼
    Image selected?
            │
            ├── ✅ YES
            │         │
            │         │   POST /api/resources/upload-image
            │         │   Headers: Authorization: Bearer <token>
            │         │   Body: FormData { image: file }
            │         ▼
            │   Backend: Multer fileFilter
            │         │   Allow image/* only, max 5MB
            │         ▼
            │   CloudinaryStorage
            │         │   Upload to folder "bangalore-bachelor"
            │         │   Transform: 800x600, quality: auto
            │         ▼
            │   Cloudinary returns secure URL
            │   imageUrl = req.file.path
            │
            └── ❌ NO → imageUrl = "" (no image)
                    │
                    ▼
            POST /api/resources
            Body: { ...formData, images: [imageUrl], amenities: [...] }
                    │
                    ▼
            MongoDB: Resource.create()
                    │
                    ▼
            Redirect to /dashboard
```

---

### 4. Review System Flow

```
User visits /resource/:id
            │
            ▼
    GET /api/resources/:id
    Populate: createdBy (name, email) + reviews.user (name)
            │
            ▼
    Display listing details + existing reviews
    Render star ratings with filled ⭐ icons
            │
    isAuthenticated?
            │
            ├── ✅ YES → Show "Add Your Review" form
            │                 │
            │                 │   Click stars (1–5) → rating updates live
            │                 │   Type review comment
            │                 │
            │                 │   POST /api/resources/:id/reviews
            │                 │   Body: { rating, comment }
            │                 ▼
            │           Already reviewed this listing?
            │                 │
            │                 ├── ✅ YES → 400 Error: "Already reviewed"
            │                 │
            │                 └── ❌ NO
            │                           │
            │                           │   Push review to reviews[]
            │                           │   Recalculate average rating
            │                           │   resource.save()
            │                           ▼
            │                     Page refreshes with new review
            │
            └── ❌ NO → Review form is hidden (not rendered)



---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 Authentication | JWT-based login & register with protected routes |
| 🔍 Search & Filter | Filter by type, area, price range, and keyword |
| 📄 Pagination | 9 listings per page with navigation |
| 📸 Image Upload | Cloudinary integration, auto-resized to 800×600 |
| ⭐ Star Ratings | Clickable interactive stars in form and review cards |
| 💬 Reviews | Add reviews with duplicate prevention per user |
| 📱 WhatsApp Direct | wa.me link with pre-filled message |
| 🗺 Google Maps | Maps integration for listing location |
| 🚦 Rate Limiting | 100 req/15min general, 10 req/15min for auth |
| 📊 Dashboard | View and manage your own listings |

---

## 🔑 Environment Variables

**Backend** — create `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/bangalore-bachelor
JWT_SECRET=your_jwt_secret_key_here

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Frontend** — create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🚀 Installation & Setup

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/bangalore-bachelor-directory.git
cd bangalore-bachelor-directory

# 2. Backend setup
cd backend
npm install
# Create .env file and fill in your credentials
node server.js

# 3. Frontend setup (open a new terminal)
cd frontend
npm install
npm run dev
```

- Backend: `http://localhost:5000`
- Frontend: `http://localhost:3000`

---

## 📡 API Endpoints

### Auth Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:---:|
| POST | /api/auth/register | Register new user | ❌ |
| POST | /api/auth/login | User login | ❌ |
| GET | /api/auth/profile | Get my profile | ✅ |

### Resource Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:---:|
| GET | /api/resources | All listings with filters + pagination | ❌ |
| GET | /api/resources/my-listings | My own listings | ✅ |
| POST | /api/resources/upload-image | Upload image to Cloudinary | ✅ |
| GET | /api/resources/:id | Single listing detail | ❌ |
| POST | /api/resources | Create new listing | ✅ |
| PUT | /api/resources/:id | Update listing | ✅ |
| DELETE | /api/resources/:id | Delete listing | ✅ |
| POST | /api/resources/:id/reviews | Add a review | ✅ |
| DELETE | /api/resources/:id/reviews/:reviewId | Delete a review | ✅ |

---

## 👨‍💻 Author

**SUMIT BHASKAR** — Bangalore Bachelor Directory  
Built with ❤️ for bachelors living in Bangalore
