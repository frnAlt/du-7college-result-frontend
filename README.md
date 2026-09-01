# 🎓 Affiliated 7 College Result Archive | University of Dhaka

> **Official Examination Result Archive & Verification Portal**  
> Developed and maintained by the Office of the Controller of Examinations, University of Dhaka.

---

## 🌟 ওভারভিউ (Overview)

এই প্ল্যাটফর্মটি ঢাকা বিশ্ববিদ্যালয় অধিভুক্ত ৭ কলেজের অফিসিয়াল রেজাল্ট পোর্টাল (`https://resapi.eco.du.ac.bd/`)-এর সম্পূর্ণ অনুরূপ এবং আধুনিক সিকিউর আর্কিটেকচারে নির্মিত। 

এখানে **Strict Allowed-List Access Control** রয়েছে:
- শুধুমাত্র কনফিগার করা অনুমোদিত **Roll Number** এবং **Registration Number**-এর জন্যই শিক্ষার্থীর রেজাল্ট এবং অফিসিয়াল PDF ট্রান্সক্রিপ্ট প্রদর্শিত ও ডাউনলোড করা যাবে।
- যেকোনো ভিন্ন বা অননুমোদিত ইনপুট দিলে কোনো বাহ্যিক সার্ভার রিকোয়েস্ট বা PDF ছাড়া সরাসরি **“Result Not Found”** দেখাবে।

---

## 🚀 ফিচারসমূহ (Key Features)

- 🏛️ **University of Dhaka Official Branding & UI:**
  - ঢাকা বিশ্ববিদ্যালয়ের অফিসিয়াল লোগো, ড্রপডাউন (Program, Exam Year, Exam) এবং লেআউট।
- 🔒 **নিরাপদ Whitelist সিকিউরিটি:**
  - ফ্রন্টএন্ডে কোনো ডাটা লিক হয় না; পুরো ভ্যালিডেশন ব্যাকএন্ডে সংরক্ষিত।
- 📄 **হাই-কোয়ালিটি PDF ট্রান্সক্রিপ্ট (PDFKit):**
  - ডিজিটাল সিল, গ্রেডিং স্কেল, সাবজেক্ট-ভিত্তিক লেটার গ্রেড এবং জিপিএ সহ প্রিন্ট ও ডাউনলোড সুবিধা।
- 🔌 **পূর্ণাঙ্গ API Compatibility:**
  - `POST /api/web-select` (`action: get_pid2`, `get_yid`, `get_eid`, `get_result`)
  - `POST /api/result`
  - `GET /api/result/pdf/:token`
- ⚡ **সিঙ্গেল Node.js প্রসেস (Single-Command Deployment):**
  - ফ্রন্টএন্ড এবং ব্যাকএন্ড একসাথে একটিমাত্র পোর্টে চলে, যা Render, Railway, VPS বা Vercel-এ সহজে ডিপ্লয় করা যায়।

---

## ⚙️ শিক্ষার্থীর রোল ও রেজাল্ট কনফিগারেশন (`data/results.json`)

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
      }
    ]
  }
]
```

---

## 💻 লোকাল রান ও টেস্ট নির্দেশিকা

### ১. ডিপেন্ডেন্সি ইনস্টল:
```bash
npm run install:all
```

### ২. ডেভেলপমেন্ট সার্ভার চালু:
```bash
npm run dev
```
- **Web Portal:** `http://localhost:5173`
- **Backend API:** `http://localhost:5000`

### ৩. ইউনিট টেস্ট চালান:
```bash
npm test
```

### ৪. প্রোডাকশন বিল্ড ও রান:
```bash
npm run build
npm start
```

---

## 🌐 গিটহাব রিপোজিটরি নাম ও ডিপ্লয়মেন্ট (Recommended Repo Rename)

GitHub-এ আপনার রিপোজিটরির নাম দিতে পারেন:
- `du-7college-result-archive` অথবা
- `Affiliated-7College-Result-Archive`

---

## 📄 লাইসেন্স
Office of the Controller of Examinations, University of Dhaka.
