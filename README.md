# Spontaneous Meetup Broadcast API 🚀

## 📌 Overview
A scalable backend system for broadcasting spontaneous meetups.  
Built with **Node.js, Express, MongoDB, Redis, and TypeScript**.

## 🛠️ Tech Stack
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: MongoDB (NoSQL)
- **Caching**: Redis
- **Queue Handling**: BullMQ
- **Testing**: Jest, Supertest
- **CI/CD**: GitHub Actions, Docker

---

## 🚀 Getting Started

### 1️ Install Dependencies
```sh
npm install
```

### 2️ Setup Environment Variables  
Create a `.env` file and add:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/meetup
REDIS_URL=redis://localhost:6379
```

### 3️ Run Locally  
```sh
npm run dev
```

### 4️ Run Tests
```sh
npm test
```

---

## 📖 API Documentation  
Access Swagger UI: [http://localhost:5000/api-docs](http://localhost:5000/api-docs)

### ✅ Sample Endpoints:
#### **Create Broadcast**
```http
POST /api/broadcasts
```
**Body:**
```json
{
  "title": "Tech Meetup",
  "description": "Discussing AI",
  "location": "Downtown Cafe",
  "expiresAt": "2025-02-20T15:00:00Z"
}
```
**Response:**
```json
{
  "message": "Broadcast created successfully",
  "broadcast": { ... }
}
```

#### **Get Active Broadcasts**
```http
GET /api/broadcasts
```

---

## ⚙️ CI/CD & Deployment
### **Automated GitHub Actions**
- Runs tests on every push.
- Deploys to production on **main** branch.

### **Deploy with Docker**
```sh
docker build -t meetup-broadcast .
docker run -p 5000:5000 meetup-broadcast
```

---

## 🤝 Contributing
1. Fork the repository.
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m "Add new feature"`
4. Push: `git push origin feature-name`
5. Open a **Pull Request** 🎉
```

---
