# ⭐ Store Rating System

A full-stack Store Rating System built using the MERN-inspired stack (React, Node.js, Express.js, PostgreSQL, Sequelize). The application supports role-based access for Admins, Store Owners, and Normal Users with secure authentication and rating management.

## 🚀 Features

### 🔐 Authentication & Authorization
- User Registration & Login
- JWT Authentication
- Role-Based Access Control
- Protected Routes

### 👤 Admin
- Dashboard with system statistics
- Create, update, view and delete users
- Create, update, view and delete stores
- Search users and stores
- Pagination support
- View store ratings and owner details

### 🏪 Store Owner
- Dashboard showing:
  - Store Information
  - Average Rating
  - Total Ratings
- View users who rated the store
- Pagination support

### 🙋 Normal User
- Browse all stores
- Search stores
- View store details
- Submit ratings
- Update ratings
- View personal ratings
- User dashboard
- Profile page

---

# 🛠️ Tech Stack

## Frontend
- React.js
- Vite
- React Router DOM
- Axios
- Tailwind CSS
- Lucide React

## Backend
- Node.js
- Express.js
- Sequelize ORM
- PostgreSQL
- JWT Authentication
- bcrypt.js

---

# 📂 Project Structure

```
Store Rating System
│
├── Frontend
│   ├── src
│   ├── public
│   └── package.json
│
├── Backend
│   ├── src
│   ├── config
│   ├── models
│   ├── routes
│   ├── controllers
│   ├── services
│   └── package.json
│
└── README.md
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/your-username/Store-Rating-System.git
cd Store-Rating-System
```

---

## Backend Setup

```bash
cd Backend
npm install
```

Create `.env`

```env
PORT=5000
DATABASE_URL=your_database_url
JWT_SECRET=your_secret_key
```

Run Backend

```bash
npm run dev
```

---

## Frontend Setup

```bash
cd Frontend
npm install
```

Create `.env`

```env
VITE_API_URL=http://localhost:5000/api
```

Run Frontend

```bash
npm run dev
```

---

# 🔑 User Roles

| Role | Permissions |
|------|-------------|
| Admin | Manage users, stores, dashboard |
| Store Owner | View store dashboard & ratings |
| User | Browse stores, rate stores, manage ratings |

---

# ✨ Key Functionalities

- JWT Authentication
- Secure Password Hashing
- Role-Based Authorization
- Store Rating System
- Average Rating Calculation
- Search Functionality
- Pagination
- Responsive UI
- RESTful APIs
- Error Handling
- Protected Routes

---

# 📸 Screenshots

You can add screenshots here.

Example:

- Login Page
- Admin Dashboard
- User Dashboard
- Store Owner Dashboard
- Store Listing
- Store Details
- My Ratings

---

# 📚 Future Improvements

- Email Verification
- Forgot Password
- Profile Management
- Store Images
- Dashboard Analytics
- Sorting Support
- Dark Mode

---

# 👨‍💻 Author

**Abhay Bhadauria**

- GitHub: https://github.com/Abhay-Bhadauria
- LinkedIn: https://www.linkedin.com/in/your-linkedin-profile/

---

## ⭐ If you like this project, consider giving it a Star!
