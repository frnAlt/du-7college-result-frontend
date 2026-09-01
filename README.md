# 🎓 Affiliated 7 College Result Archive | University of Dhaka

> **Official Examination Result Archive & Verification Portal**  
> Developed and maintained by the Office of the Controller of Examinations, University of Dhaka.

---

## 📑 সূচিপত্র (Table of Contents)
1. [🌟 ওভারভিউ (Overview)](#-ওভারভিউ-overview)
2. [🔒 অ্যাক্সেস কন্ট্রোল ও লজিক (Access Control Logic)](#-অ্যাক্সেস-কন্ট্রোল-ও-লজিক-access-control-logic)
3. [🔐 Environment Variables গাইড (.env)](#-environment-variables-গাইড-env)
4. [💻 লোকাল সেটআপ গাইড (Local Setup Guide)](#-লোকাল-সেটআপ-গাইড-local-setup-guide)
5. [⚙️ রেজাল্ট ডাটা কনফিগারেশন (Data Configuration Guide)](#️-রেজাল্ট-ডাটা-কনফিগারেশন-data-configuration-guide)
6. [▲ Vercel ডিপ্লয়মেন্ট গাইড (Vercel Deployment Guide)](#-vercel-ডিপ্লয়মেন্ট-গাইড-vercel-deployment-guide)
7. [🚀 Render / Railway ডিপ্লয়মেন্ট গাইড (Render & Railway Deployment)](#-render--railway-ডিপ্লয়মেন্ট-গাইড-render--railway-deployment)
8. [🧪 টেস্ট ও ভেরিফিকেশন (Automated Tests)](#-টেস্ট-ও-ভেরিফিকেশন-automated-tests)
9. [🔌 API Endpoints](#-api-endpoints)

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
- **সিকিউরিটি:** সম্পূর্ণ Whitelist ব্যাকএন্ডে সংরক্ষিত থাকে, ফ্রন্টএন্ডে কোনো তালিকা এক্সপোজ হয় না।

---

## 🔐 Environment Variables গাইড (.env)

ডিপ্লয়মেন্ট ড্যাশবোর্ডে (Render / Vercel / Railway) ভ্যারিয়েবলগুলোর কনফিগারেশন বিবরণী:

| Variable Name | Required in Prod? | Safe Default Value | Description |
|---|---|---|---|
| `NODE_ENV` | Optional | `production` | `production` অথবা `development` |
| `PORT` | Optional | `5000` | সার্ভার লিসেনিং পোর্ট |
| `CLIENT_ORIGIN` | Optional | `""` (Empty) | ফ্রন্টএন্ড ডোমেইন URL (CORS-এর জন্য)। ফ্রন্টএন্ড ও ব্যাকএন্ড একই ডোমেইনে থাকলে ফাঁকা রাখা যাবে। |
| `ENABLE_EXTERNAL_API` | Optional | `false` | এক্সটার্নাল API অন/অফ। `false` থাকলে শুধু লোকাল `data/results.json` কাজ করবে। |
| `EXTERNAL_API_BASE` | Optional | `""` (Empty) | এক্সটার্নাল API URL (শুধুমাত্র `ENABLE_EXTERNAL_API=true` হলে প্রয়োজন)। |
| `EXTERNAL_API_TOKEN` | Optional | `""` (Empty) | এক্সটার্নাল API টোকেন (শুধুমাত্র `ENABLE_EXTERNAL_API=true` হলে প্রয়োজন)। |
| `RATE_LIMIT_WINDOW_MS` | Optional | `900000` (15 মিনিট) | রেট লিমিটের সময়সীমা (মিলিসেকেন্ডে)। |
| `RATE_LIMIT_MAX` | Optional | `60` | সর্বোচ্চ অনুমোদিত রিকোয়েস্ট সংখ্যা (প্রতি IP)। |

### 🚀 Production Deployment-এর জন্য সুপারিশকৃত সেটিংস:
যদি আপনি লোকাল `data/results.json` দিয়ে রেজাল্ট দেখাতে চান (যা ডিফল্ট এবং রেকমেন্ডেড):

```env
NODE_ENV=production
ENABLE_EXTERNAL_API=false
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=60
```
> 💡 `EXTERNAL_API_BASE` এবং `EXTERNAL_API_TOKEN` ড্যাশবোর্ডে **ফাঁকা (Unset)** রাখা যাবে, এতে সার্ভার ক্র্যাশ করবে না।

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
    "roll": "13569",
    "registration": "2022140676",
    "name": "SAZIRAZAMAN MUTTACIN",
    "college_name": "Dhaka College",
    "sub_name": "English",
    "exam_title": "Honors 2nd Year 2024",
    "session_name": "2022-23",
    "second_gpa": "3.16",
    "pstatus": "Promoted",
    "courses": [
      {
        "code": "221909",
        "title": "Political Organization and the Political System of UK and USA",
        "letter_grade": "B+",
        "grade_point": "3.25",
        "credit": "4"
      }
    ]
  }
]
```

> 💡 **নোট:** ফাইলটিতে কোনো পরিবর্তন করলে সার্ভার রিস্টার্ট করা ছাড়াই স্বয়ংক্রিয়ভাবে লাইভ আপডেট হয়ে যাবে (Hot-Reloading)।

---

## ▲ Vercel ডিপ্লয়মেন্ট গাইড (Vercel Deployment Guide)

1. [Vercel Dashboard](https://vercel.com/new)-এ যান।
2. আপনার GitHub অ্যাকাউন্ট থেকে `frnAlt/du-7college-result-frontend` সিলেক্ট করে **Import** করুন।
3. **Environment Variables** সেকশনে চাইলে `NODE_ENV=production` দিন (বাকিগুলো অপশনাল)।
4. **Deploy** বাটনে ক্লিক করুন।

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

---

## 🧪 টেস্ট ও ভেরিফিকেশন (Automated Tests)

ব্যাকএন্ডের ভ্যালিডেশন, নট-ফাউন্ড হ্যান্ডলিং এবং PDF জেনারেশন টেস্ট করতে চালান:

```bash
npm test
```

---

## 🔌 API Endpoints

### ১. Check Result (`POST /api/result` বা `POST /api/web-select`)
- **Request Body:**
```json
{
  "roll": "13569",
  "registration": "2022140676"
}
```
- **Response (Allowed Record - 200 OK):**
```json
{
  "success": true,
  "result": {
    "roll": "13569",
    "registration": "2022140676",
    "name": "SAZIRAZAMAN MUTTACIN",
    "college_name": "Dhaka College",
    "sub_name": "English",
    "second_gpa": "3.16",
    "pstatus": "Promoted",
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

## 📄 লাইসেন্স
Developed & maintained by the Office of the Controller of Examinations, University of Dhaka.
