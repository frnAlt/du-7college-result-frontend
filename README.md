# 🎓 BoardResultsBD - Secure Result Verification & PDF Portal

একটি আধুনিক, নিরাপদ এবং পেশাদার **Student Result Checking & PDF Transcript Generation** ওয়েব প্ল্যাটফর্ম।

এই প্ল্যাটফর্মে **Strict Allowed-List Access Control** কার্যকর রয়েছে—অর্থাৎ শুধুমাত্র backend-এ কনফিগার করা নির্দিষ্ট **Roll Number** এবং **Registration Number**-এর জন্যই রেজাল্ট ও PDF প্রদর্শিত হবে। যেকোনো ভুল বা অননুমোদিত রোল/রেজিস্ট্রেশন দিলে সরাসরি **"Result Not Found"** দেখাবে।

---

## 🌟 প্রধান সুবিধাসমূহ (Key Features)

- 🔒 **নিরাপদ অ্যাক্সেস কন্ট্রোল (Strict Whitelist Logic):**
  - শুধুমাত্র `data/results.json`-এ কনফিগার করা অনুমোদিত Roll + Registration পেয়ারের জন্যই রেজাল্ট আসবে।
  - frontend bundle-এ কোনো রোল/রেজিস্ট্রেশন লিস্ট এক্সপোজ হয় না; পুরো সিকিউরিটি ব্যাকএন্ড থেকে নিয়ন্ত্রিত।
  - অমিল বা র‍্যান্ডম ইনপুটের ক্ষেত্রে কোনো বাহ্যিক API কল হয় না, কোনো PDF জেনারেট হয় না—সরাসরি `{ "success": false, "message": "Result Not Found" }` রিটার্ন করে।
- 📄 **অফিসিয়াল PDF ট্রান্সক্রিপ্ট ও প্রিভিউ (PDFKit Engine):**
  - প্রাতিষ্ঠানিক ফরম্যাটে স্বয়ংক্রিয়ভাবে প্রফেশনাল PDF জেনারেট হয় (Student Profile, CGPA, Subject-wise Grades, Digital Seal & Verification Timestamp)।
  - ব্রাউজারেই সরাসরি **In-Browser Interactive PDF Preview** দেখা যায়।
  - এক ক্লিকে **Download PDF** এবং **Print** করার সুবিধা।
- 🌐 **বাহ্যিক API ইন্টিগ্রেশন (DU 7-College & Board Support):**
  - `https://resapi.eco.du.ac.bd/` API আর্কিটেকচার অনুযায়ী ডিজাইন করা।
  - প্রয়োজন অনুযায়ী বাহ্যিক সার্ভার থেকে ডাটা সিঙ্ক করার অপশন এবং অফলাইন/লোকাল ব্যাকআপের শক্তিশালী ফলব্যাক মেকানিজম।
- 📱 **Mobile-First ও আধুনিক রেসপনসিভ UI:**
  - Tailwind CSS ও React দিয়ে তৈরি পরিচ্ছন্ন ও প্রফেশনাল ইউজার ইন্টারফেস।
  - মোবাইল, ট্যাবলেট, ল্যাপটপ এবং ডেস্কটপে শতভাগ রেসপনসিভ।
  - বাংলা ও ইংরেজি উভয় ভাষায় স্পষ্ট টেক্সট সাপোর্ট।
- 🛡️ **Rate Limiting & Input Validation:**
  - Brute-force আক্রমণ প্রতিহত করতে Express Rate Limiter যুক্ত।
  - ইনপুট স্যানিটাইজেশন এবং সিকিউরিটি হেডার (Helmet, CORS)।

---

## 📁 প্রজেক্ট স্ট্রাকচার (Project Architecture)

```text
BoardResultsBD/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── env.js                 # Environment configuration
│   │   ├── controllers/
│   │   │   └── resultController.js    # Result check & PDF streaming logic
│   │   ├── middleware/
│   │   │   ├── rateLimiter.js         # API rate limiter (Anti-abuse)
│   │   │   └── validator.js           # Input validation & sanitization
│   │   ├── routes/
│   │   │   └── resultRoutes.js        # /api/result, /api/result/pdf/:id
│   │   ├── services/
│   │   │   ├── externalApiService.js  # External DU 7-college API client
│   │   │   ├── pdfService.js          # High-fidelity PDFKit generator
│   │   │   └── resultService.js       # Whitelist verification & cache
│   │   ├── utils/
│   │   │   └── logger.js              # Safe server logging
│   │   └── server.js                  # Express application setup
│   ├── data/
│   │   └── results.json               # Allowed student records database
│   ├── test/
│   │   └── server.test.js             # Automated test suite
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx             # Official banner & logo
│   │   │   ├── Footer.jsx             # Academic copyright & verification
│   │   │   ├── SearchForm.jsx         # Roll/Reg search input form
│   │   │   ├── ResultCard.jsx         # Found result card with grades & actions
│   │   │   ├── ResultNotFound.jsx     # Clean "Result Not Found" state
│   │   │   ├── LoadingState.jsx       # Verification loading skeleton
│   │   │   └── PdfPreviewModal.jsx    # In-browser PDF preview modal
│   │   ├── services/
│   │   │   └── api.js                 # Frontend API client
│   │   ├── App.jsx                    # Main application controller
│   │   ├── index.css                  # Tailwind styles
│   │   └── main.jsx
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
├── data/
│   └── results.json                   # Root accessible dataset
├── scripts/
│   └── dev.js                         # Concurrent development launcher
├── .env.example
├── package.json                       # Workspace orchestrator
└── README.md
```

---

## ⚙️ নতুন Roll / Registration ও Result যুক্ত করার নিয়ম (Data Configuration)

নতুন কোনো শিক্ষার্থীর রেজাল্ট যুক্ত বা পরিবর্তন করার জন্য আপনাকে কোড পরিবর্তন করতে হবে না। শুধুমাত্র `data/results.json` (অথবা `backend/data/results.json`) ফাইলে একটি নতুন অবজেক্ট যোগ করুন:

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

> **লক্ষণীয়:** সার্ভার রিস্টার্ট করা ছাড়াই ফাইল এডিট করলে স্বয়ংক্রিয়ভাবে হট-রিলোড (Hot-Reload) হয়ে নতুন ডাটা লোড হয়ে যাবে।

---

## 🚀 লোকাল সেটআপ ও রান করার নিয়ম (Installation & Quickstart)

### ১. ডিপেন্ডেন্সি ইনস্টল করুন:
```bash
npm run install:all
```
*(অথবা আলাদা আলাদা ফোল্ডারে `npm install` চালাতে পারেন)*

### ২. এনভায়রনমেন্ট ভ্যারিয়েবল সেট করুন:
```bash
cp .env.example backend/.env
```

### ৩. ডেভেলপমেন্ট সার্ভার চালু করুন (Frontend + Backend একসাথে):
```bash
npm run dev
```
- **Frontend URL:** `http://localhost:5173`
- **Backend API URL:** `http://localhost:5000`

---

## 🧪 স্বয়ংক্রিয় টেস্ট চালানো (Run Unit Tests)

ব্যাকএন্ডের ভ্যালিডেশন, নট-ফাউন্ড হ্যান্ডলিং এবং PDF জেনারেশন টেস্ট করতে:

```bash
npm test
```

---

## 🔌 API Endpoints Documentation

### ১. Check Result
- **Method:** `POST`
- **Path:** `/api/result`
- **Request Body:**
```json
{
  "roll": "123456",
  "registration": "9876543210"
}
```
- **Response (Valid Allowed Record - 200 OK):**
```json
{
  "success": true,
  "message": "Result retrieved successfully",
  "result": {
    "roll": "123456",
    "registration": "9876543210",
    "name": "MD. ARIFUL ISLAM",
    "college_name": "Dhaka College, Dhaka",
    "sub_name": "Computer Science & Engineering",
    "cgpa": "3.76",
    "pstatus": "PASSED (First Class)",
    "courses": [...]
  },
  "pdfUrl": "/api/result/pdf/7a8f3b..."
}
```
- **Response (Not Allowed / Invalid Input - 404 Not Found):**
```json
{
  "success": false,
  "message": "Result Not Found"
}
```

### ২. Get Result PDF
- **Method:** `GET`
- **Path:** `/api/result/pdf/:token`
- **Query Parameter (Optional):** `?download=1` (সরাসরি ডাউনলোড করার জন্য)
- **Response:** `application/pdf` স্ট্রিম

### ৩. Health Check
- **Method:** `GET`
- **Path:** `/api/health`

---

## 🌐 ডিপ্লয়মেন্ট গাইড (Deployment Guide)

### Render / Railway / VPS (Node.js Fullstack)
1. গিট রিপোজিটরি পুশ করুন।
2. **Build Command:** `npm run build`
3. **Start Command:** `npm start`
4. Environment variables-এ `PORT=5000` এবং `CLIENT_ORIGIN` সেট করুন।

---

## 📄 লাইসেন্স
MIT License.
