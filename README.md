# 🎓 Affiliated 7 College Result Archive | University of Dhaka

> **Official Examination Result Archive & Verification Portal**  
> Developed and maintained by the Office of the Controller of Examinations, University of Dhaka.

---

## 📑 সূচিপত্র (Table of Contents)
1. [🌟 ওভারভিউ (Overview)](#-ওভারভিউ-overview)
2. [🔒 অ্যাক্সেস কন্ট্রোল ও লজিক (Access Control Logic)](#-অ্যাক্সেস-কন্ট্রোল-ও-লজিক-access-control-logic)
3. [💻 লোকাল সেটআপ গাইড (Local Setup Guide)](#-লোকাল-সেটআপ-গাইড-local-setup-guide)
4. [⚙️ রেজাল্ট ডাটা কনফিগারেশন (Data Configuration Guide)](#️-রেজাল্ট-ডাটা-কনফিগারেশন-data-configuration-guide)
5. [▲ Vercel ডিপ্লয়মেন্ট গাইড (Vercel Deployment Guide)](#-vercel-ডিপ্লয়মেন্ট-গাইড-vercel-deployment-guide)
6. [🚀 Render / Railway ডিপ্লয়মেন্ট গাইড (Render & Railway Deployment)](#-render--railway-ডিপ্লয়মেন্ট-গাইড-render--railway-deployment)
7. [🧪 টেস্ট ও ভেরিফিকেশন (Automated Tests)](#-টেস্ট-ও-ভেরিফিকেশন-automated-tests)
8. [🔌 API Endpoints](#-api-endpoints)
9. [🔐 Environment Variables (.env)](#-environment-variables-env)

---

## 🌟 ওভারভিউ (Overview)

এই প্ল্যাটফর্মটি ঢাকা বিশ্ববিদ্যালয় অধিভুক্ত ৭ কলেজের অফিশিয়াল রেজাল্ট আর্কাইভ (`https://resapi.eco.du.ac.bd/`)-এর সম্পূর্ণ অনুরূপ এবং আধুনিক সিকিউর আর্কিটেকচারে নির্মিত। 

- 🏛️ **অফিশিয়াল ঢাকা বিশ্ববিদ্যালয় ব্র্যান্ডিং ও ইউজার ইন্টারফেস**
- 📄 **ব্রাউজারে সরাসরি PDF রেজাল্ট ট্রান্সক্রিপ্ট প্রিভিউ ও ডাউনলোড সুবিধা**
- ⚡ **সিঙ্গেল Node.js ও Serverless Ready আর্কিটেকচার (Vercel & Render Compatible)**
- 🛡️ **অটোমেটিক Rate Limiting এবং Input Validation**

---

## 🔒 অ্যাক্সেস কন্ট্রোল ও লজিক (Access Control Logic)

আপনার কনফিগার করা তথ্যের বাইরে কোনো ডাটা প্রদর্শিত হবে না:
- **অনুমোদিত রোল ও রেজিস্ট্রেশন:** ব্যবহারকারী যখন `data/results.json`-এ থাকা সঠিক Roll Number এবং Registration Number দেবে, শুধুমাত্র তখনই শিক্ষার্থীর রেজাল্ট এবং অফিসিয়াল PDF ট্রান্সক্রিপ্ট আসবে।
- **অননুমোদিত বা ভুল ইনপুট:** অন্য যেকোনো রোল, রেজিস্ট্রেশন বা ভুল নাম্বার দিলে কোনো এক্সটার্নাল রিকোয়েস্ট ছাড়াই তাৎক্ষণিকভাবে **“Result Not Found”** দেখাবে।
- **সিকিউরিটি:** সম্পূর্ণ Whitelist ব্যাকএন্ডে সংরক্ষিত থাকে, ফ্রন্টএন্ড থেকে কেউ অনুমোদিত তালিকা দেখতে পারবে না।

---

## 💻 লোকাল সেটআপ গাইড (Local Setup Guide)

### ধাপ ১: রিপোজিটরি ক্লোন করুন
```bash
git clone git@github.com:frnAlt/du-7college-result-frontend.git
cd du-7college-result-frontend
```

### ধাপ ২: সকল ডিপেন্ডেন্সি ইনস্টল করুন
```bash
npm run install:all
```
*(এটি রুট, ফ্রন্টএন্ড এবং ব্যাকএন্ডের সকল প্রয়োজনীয় প্যাকেজ ইনস্টল করবে)*

### ধাপ ৩: Environment Variables তৈরি করুন
```bash
cp .env.example backend/.env
```

### ধাপ ৪: ডেভেলপমেন্ট সার্ভার রান করুন
```bash
npm run dev
```
- 🌐 **Web Interface:** `http://localhost:5173`
- ⚙️ **Backend API:** `http://localhost:5000`

---

## ⚙️ রেজাল্ট ডাটা কনফিগারেশন (Data Configuration Guide)

নতুন কোনো শিক্ষার্থীর রোল, রেজিস্ট্রেশন ও রেজাল্ট যোগ করতে [`data/results.json`](file:///home/ffjisan804/BoardResultsBD/data/results.json) ফাইলে ডাটা যুক্ত করুন:

```json
[
  {
    "id": "std-001",
    "roll": "123456",
    "registration": "9876543210",
    "name": "MD. ARIFUL ISLAM",
    "father_name": "MD. RAFIQUL ISLAM",
    "mother_name": "MORIOM BEGUM",
    "college_name": "Dhaka College, Dhaka",
    "sub_name": "Computer Science & Engineering",
    "exam_title": "B.Sc (Honours) 4th Year Examination - 2023",
    "session_name": "2019-2020",
    "first_gpa": "3.65",
    "second_gpa": "3.72",
    "third_gpa": "3.80",
    "fourth_gpa": "3.88",
    "cgpa": "3.76",
    "pstatus": "PASSED (First Class)",
    "pdate": "15 August, 2024",
    "courses": [
      {
        "code": "CSE-401",
        "title": "Artificial Intelligence & Neural Networks",
        "letter_grade": "A+",
        "grade_point": "4.00",
        "credit": "4.0"
      },
      {
        "code": "CSE-402",
        "title": "Software Architecture & Design Patterns",
        "letter_grade": "A",
        "grade_point": "3.75",
        "credit": "4.0"
      }
    ],
    "externalFetch": {
      "enabled": false
    }
  }
]
```

> 💡 **নোট:** ফাইলটিতে কোনো পরিবর্তন করলে সার্ভার রিস্টার্ট করা ছাড়াই স্বয়ংক্রিয়ভাবে লাইভ আপডেট হয়ে যাবে (Hot-Reloading)।

---

## ▲ Vercel ডিপ্লয়মেন্ট গাইড (Vercel Deployment Guide)

প্রজেক্টটিতে `vercel.json` এবং `api/index.js` কনফিগার করা রয়েছে, ফলে Vercel-এ এটি ১-ক্লিকে ডিপ্লয় হয়:

1. [Vercel Dashboard](https://vercel.com/new)-এ যান।
2. আপনার GitHub অ্যাকাউন্ট থেকে `frnAlt/du-7college-result-frontend` সিলেক্ট করে **Import** করুন।
3. **Framework Preset:** `Vite` সিলেক্ট থাকবে।
4. **Build & Output Settings:** ডিফল্টই থাকবে (স্বয়ংক্রিয়ভাবে `vercel.json` থেকে লোড হবে)।
5. **Deploy** বাটনে ক্লিক করুন।

---

## 🚀 Render / Railway ডিপ্লয়মেন্ট গাইড (Render & Railway Deployment)

### Render.com:
1. Render ড্যাশবোর্ডে গিয়ে **New Web Service** সিলেক্ট করুন।
2. গিটহাব রিপোজিটরি কানেক্ট করুন।
3. সেটিংস দিন:
   - **Environment:** `Node`
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
4. **Create Web Service** বাটনে ক্লিক করুন।

### Railway.app:
1. **New Project** ➜ **Deploy from GitHub repo** সিলেক্ট করুন।
2. রিপোজিটরি কানেক্ট করলেই Railway নিজে থেকেই `npm start` দিয়ে লাইভ করে দেবে।

---

## 🧪 টেস্ট ও ভেরিফিকেশন (Automated Tests)

ব্যাকএন্ডের ভ্যালিডেশন, নট-ফাউন্ড হ্যান্ডলিং এবং PDF জেনারেশন স্বয়ংক্রিয়ভাবে টেস্ট করতে চালান:

```bash
npm test
```

---

## 🔌 API Endpoints

### ১. Check Result (`POST /api/result` বা `POST /api/web-select`)
- **Request Body:**
```json
{
  "roll": "123456",
  "registration": "9876543210"
}
```
- **Response (Allowed Record - 200 OK):**
```json
{
  "success": true,
  "result": {
    "roll": "123456",
    "registration": "9876543210",
    "name": "MD. ARIFUL ISLAM",
    "college_name": "Dhaka College, Dhaka",
    "cgpa": "3.76",
    "pstatus": "PASSED (First Class)",
    "courses": [...]
  },
  "pdfUrl": "/api/result/pdf/..."
}
```
- **Response (Not Allowed / Random Input - 404 Not Found):**
```json
{
  "success": false,
  "message": "Result Not Found"
}
```

### ২. Download / Preview PDF (`GET /api/result/pdf/:token`)
- **Preview:** `/api/result/pdf/:token`
- **Direct Download:** `/api/result/pdf/:token?download=1`

### ৩. Health Check (`GET /api/health`)

---

## 🔐 Environment Variables (.env)

```env
PORT=5000
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5173
EXTERNAL_API_BASE=https://resapi.eco.du.ac.bd
EXTERNAL_API_TOKEN=8f3c1e2d3a4b5c6d7e8f9a0b1c2d3e4f
ENABLE_EXTERNAL_API=true
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

---

## 📄 লাইসেন্স
Developed & maintained by the Office of the Controller of Examinations, University of Dhaka.
