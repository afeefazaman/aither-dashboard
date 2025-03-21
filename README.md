# Aither Dashboard  

A web-based platform integrating multiple enterprise services (Google Drive, Google Calendar, Slack, Jira, GitHub) to provide a unified dashboard for users.  

## Features  
✅ User authentication (Signup, Login, Logout)  
✅ Google OAuth for Drive & Calendar integration  
✅ Fetch latest Google Drive files & upcoming Google Calendar events  
✅ Next.js frontend with Tailwind CSS  
✅ Node.js backend with Express and Prisma  

---

## 🛠️ Tech Stack  

### **Frontend**  
- **Framework**: Next.js (React)  
- **Styling**: Tailwind CSS  
- **State Management**: Context api 
- **Authentication**: Custom backend authentication (JWT)  

### **Backend**  
- **Runtime**: Node.js  
- **Framework**: Express.js  
- **Database**: PostgreSQL  
- **ORM**: Prisma  
- **Authentication**: JWT + OAuth (Google & GitHub)  

---

## 🚀 Getting Started  

### **1. Clone the Repository**  
```sh
git clone https://github.com/afeefazaman/aither-dashboard.git
cd aither-dashboard
```

---

## 🔧 Backend Setup  

### **1. Install Dependencies**  
```sh
cd server
npm install
```

### **2. Configure Environment Variables**  
Create a `.env` file in the `server` directory based on `.env.example`:  

#### `.env` (Server)
```env
PORT=8001
DATABASE_URL="postgresql://postgres:@localhost:5432/aither_db?schema=public"
JWT_SECRET=your_jwt_secret_key

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:8001/google/auth/google/callback

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# CORS Config
FRONTEND_URL=http://localhost:3001
BACKEND_URL=http://localhost:8001
```

### **3. Set Up the Database**  
```sh
npx prisma migrate dev --name init
npx prisma generate
```

### **4. Start the Server**  
```sh
npm run dev
```
Server will run at **`http://localhost:8001`**.

---

## 🎨 Frontend Setup  

### **1. Install Dependencies**  
```sh
cd client
npm install
```

### **2. Configure Environment Variables**  
Create a `.env.local` file in the `client` directory based on `.env.example`:  

#### `.env.local` (Client)
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8001
```

### **3. Start the Frontend**  
```sh
npm run dev
```
Frontend will run at **`http://localhost:3001`**.

---

## 🔑 Setting Up OAuth  

### **Google OAuth Setup**  

1. Go to [Google Cloud Console](https://console.cloud.google.com/).  
2. Create a new project.  
3. Enable **Google Drive API** and **Google Calendar API**.  
4. Go to **Credentials** → **Create OAuth Client ID**.  
5. Choose **Web Application** and add:  
   - **Authorized Redirect URI**:  
     ```
     http://localhost:8001/google/auth/google/callback
     ```  
6. Copy **Client ID** & **Client Secret** into `.env`.  

---

### **GitHub OAuth Setup**  

1. Go to [GitHub Developer Settings](https://github.com/settings/developers).  
2. Click **New OAuth App** and configure:  
   - **Homepage URL**: `http://localhost:3001`  
   - **Authorization callback URL**:  
     ```
     http://localhost:8001/github/auth/callback
     ```
3. Copy **Client ID** & **Client Secret** into `.env`.  

---

## 🛠 API Endpoints  

### **Authentication**  
- `POST /auth/signup` – Register new users  
- `POST /auth/login` – Authenticate and return JWT token  
- `GET /auth/logout` – Logout user  

### **Google Drive**  
- `GET /google/drive/files` – Fetch latest 5 modified files  

### **Google Calendar**  
- `GET /google/calendar/events` – Fetch upcoming 5 events  

---

## 📜 License  
This project is licensed under the MIT License.  

---

Now, you can just replace `your-username` and `your_google_client_id` with your actual credentials before uploading to GitHub! 🚀