# 🤖 InterviewAI - AI-Powered Mock Interview Platform

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/Node.js-v18+-green.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

**InterviewAI** is an intelligent mock interview application designed to help developers practice technical, behavioral, and role-specific questions. Powered by **Google Gemini AI**, it generates personalized questions based on your resume and provides real-time feedback with scoring.

🔗 **[Live Demo](https://interviewly-ai.vercel.app/)**

---

## 🚀 Key Features

- **🧠 AI-Powered Question Generation:** Uses Gemini AI (Flash Model) to create unique questions dynamically based on difficulty and topic.
- **📄 Resume Analysis:** Upload your resume (PDF) to get tailored questions based on your actual skills and projects.
- **🎙️ Realistic Simulation:**
  - **Technical:** DSA & System Design questions.
  - **Behavioral:** HR rounds focusing on the STAR method.
  - **AI-Powered:** Personalized deep-dives into your specific experience.
- **📊 Detailed Feedback:** Get instant scores (0-100), strength analysis, and improvement areas after every answer.
- **📈 Progress Tracking:** Comprehensive dashboard with charts to track interview history, average scores, and practice streaks.
- **🔐 Secure Authentication:** Complete JWT-based auth system with profile management.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Lucide React
- **Backend:** Next.js API Routes (Serverless)
- **Database:** MongoDB Atlas (Mongoose)
- **AI Engine:** Google Gemini API (gemini-2.5-flash-lite)
- **Authentication:** JWT (JSON Web Tokens) & Context API
- **Deployment:** Vercel (Frontend/API) + MongoDB Atlas (DB)

---


## 🔧 Installation & Local Setup

Follow these steps to run the project locally:

### 1. Clone the Repository
```bash
git clone [https://github.com/ritesh-negii/interviewly-ai.git](https://github.com/ritesh-negii/interviewly-ai.git)
cd interviewly-ai

2. Install Dependencies
Bash

npm install
3. Environment Variables
Create a .env.local file in the root directory and add the following configuration:

Code snippet

# MongoDB Connection (Get this from MongoDB Atlas)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority

# Security (Any random string for JWT encryption)
JWT_SECRET=your_super_secret_key_123

# AI Configuration (Get keys from Google AI Studio)
# You can add multiple keys separated by commas for automatic rotation
GEMINI_API_KEYS=key1,key2,key3

# App URL
NEXT_PUBLIC_API_URL=http://localhost:3000
4. Run the Development Server
Bash

npm run dev
Open http://localhost:3000 in your browser.

🌟 How It Works
Sign Up: Create an account to save your progress and streaks.

Upload Resume: (Optional) Upload a PDF resume. The AI parses your skills and projects to ask relevant questions.

Choose Mode: Select from Technical, Behavioral, or AI-Powered interview modes.

Practice: Answer AI-generated questions in real-time.

Review: Receive a detailed performance report with actionable feedback and scoring.

🤝 Contributing
Contributions are welcome!

Fork the project

Create your feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request

📬 Contact
Ritesh - GitHub

Built with ❤️ and ☕.