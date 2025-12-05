Here is a **clean, polished, merged, and recruiter-friendly `README.md`** that combines the strengths of both files while removing repetition and keeping everything crisp, modern, and impressive.

You can **directly paste this into GitHub**.

---

# 🎥 **GLIMPSE — AI-Powered Video SaaS Platform**

**Glimpse** is a next-generation video hosting and analysis platform built with **Next.js (App Router)**, **Cloudinary**, **Prisma**, **Clerk**, and **Google Gemini Multimodal AI**.

Beyond simple uploads, Glimpse allows users to **chat with their videos**, using AI to understand visual content through multimodal reasoning.

This system is designed to be production-ready, scalable, and optimized for both creators and developers.

---

## 🚀 **Key Features**

### 🔐 Authentication & Security

* Secure Sign Up / Sign In using **Clerk**
* Middleware-protected routes
* User-level authorization for videos

### ☁️ Smart Video Uploads

* Signed uploads directly to **Cloudinary** (no server overload)
* Automatic compression & optimization
* Track original vs compressed size savings

### 📊 Video Management Dashboard

* View, search, sort, update, and delete videos
* Public sharing pages optimized using **Next.js Server Components**

### 🎬 Premium Playback Experience

* Custom video player powered by **Plyr**
* Supports speed control, PiP, fullscreen, mobile UI

### 🤖 AI Video Analysis (Gemini Multimodal)

Ask questions like:

> “What object is the person holding in the first scene?”

AI workflow:

1. Extracts **5 storyboard frames** at 0%, 20%, 40%, 60%, 80% using Cloudinary
2. Downloads frames as buffers on the server
3. Sends frames + question prompt to **Google Gemini 2.5 Flash**
4. Returns contextual, visual-aware answers

### 🎨 Clean Modern UI

* Tailwind CSS + DaisyUI + Lucide Icons
* Light & Dark mode
* Fully responsive across devices

---

## 🛠️ **Tech Stack**

| Layer             | Technology                           |
| ----------------- | ------------------------------------ |
| **Framework**     | Next.js (App Router)                 |
| **Language**      | TypeScript                           |
| **Database**      | PostgreSQL                           |
| **ORM**           | Prisma                               |
| **Auth**          | Clerk                                |
| **Storage & CDN** | Cloudinary                           |
| **AI Model**      | Google Gemini 2.5 Flash (Multimodal) |
| **Styling**       | Tailwind CSS, DaisyUI                |
| **Video Player**  | Plyr                                 |
| **Utilities**     | Axios, Day.js, React Hot Toast       |

---

## 🧱 **Project Architecture**

```
├── app/
│   ├── (app)/          # Auth-protected Dashboard, Profile, Upload
│   ├── (auth)/         # Sign-in / Sign-up pages
│   ├── api/            # AI, video, webhook, and upload APIs
│   └── page.tsx        # Public Landing Page
├── components/         # Reusable UI components
├── prisma/             # Prisma schema and migrations
├── types/              # TS interfaces
└── middleware.ts       # Clerk-auth route protection
```

---

## 🧠 **How the AI System Works (Multimodal Pipeline)**

1. **Generate Frame URLs**
   Cloudinary creates 5 screenshot frames at distributed timestamps.

2. **Fetch & Buffer Images**
   Server downloads frames → binary buffers → Gemini ready format.

3. **Multimodal Prompt Construction**
   Input = text question + image buffers + video metadata.

4. **Gemini Analysis**
   AI visually inspects content and answers contextually.

---

## 🗄️ **Database Schema (Prisma)**

```prisma
model Video {
  id             String   @id @default(cuid())
  title          String
  description    String?
  publicId       String   // Cloudinary ID
  originalSize   String
  compressedSize String
  duration       Float
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  userId         String   // Clerk User ID
}
```

---

## ⚙️ **Environment Variables**

Add the following to your `.env` file:

```env
# Database
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Google Gemini
GEMINI_API_KEY=your_gemini_api_key
```

---

## 💻 **Getting Started**

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/glimpse.git
cd glimpse
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup database

```bash
npx prisma generate
npx prisma db push
```

*or for migrations:*

```bash
npx prisma migrate dev --name init
```

### 4. Run development server

```bash
npm run dev
```

Visit:
👉 [http://localhost:3000](http://localhost:3000)

---

## 📸 Screenshots

(Add these for a stronger GitHub profile)

* Dashboard
* Video Player
* AI Chat Interface
* Upload Page

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch
3. Commit your changes
4. Push to GitHub
5. Submit a pull request

---

## 📄 License

This project is licensed under the **MIT License**.

---

If you’d like, I can also:
✅ Generate a **professional GitHub repo description**
✅ Create **badges** (Vercel, Cloudinary, Gemini, TypeScript, etc.)
✅ Create a **demo GIF** text guide
Just tell me!
