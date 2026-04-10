# BrightPath: Institution Management System

BrightPath is a premium, high-fidelity management portal designed for modern tuition centers and educational institutions. It provides a comprehensive "Executive Command Center" for administrators, streamlined tools for teachers, and performance-centric dashboards for students.

## 🚀 Core Features

### 🏛️ Admin Command Center
- **Strategic Insights**: Real-time teaching velocity and operational audit graphs.
- **Financial Hub**: Complete revenue/expense tracking, automated tutor payroll, and student fee management.
- **Monthly Analytics**: In-depth performance reports aggregating exams, attendance, and financial health.
- **Management**: Global control over students, faculty, subjects, and institutional targets.

### 👨‍🏫 Faculty Suite
- **Attendance Ledger**: Live session logging with duration tracking.
- **Exam Management**: Streamlined mark entry and student progress feedback.
- **Performance Analysis**: Personal teaching statistics and incentive tracking.

### 🎓 Student Portal
- **Academic Dashboard**: Real-time access to attendance records and exam performance.
- **Progress Reports**: Automated generation of monthly performance dossiers.

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: MongoDB with Mongoose ODM
- **Visualization**: Recharts (Executive Grade Charts)
- **Icons**: Lucide React
- **Styling**: Tailwind CSS
- **Authentication**: JWT-based Secure Authorization
- **Reports**: PDF-Lib & PDFKit for automated document generation

## ⚙️ Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd brightpath
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory and copy the contents from `.env.example`:
   ```bash
   cp .env.example .env.local
   ```
   Fill in your MongoDB URI, JWT Secret, and Cloudinary credentials.

4. **Launch Development Server**:
   ```bash
   npm run dev
   ```

## 📦 Deployment

This project is optimized for deployment on **Vercel**:

1. Push your code to a GitHub/GitLab/Bitbucket repository.
2. Import the project into Vercel.
3. Add the required environment variables.
4. The build script `next build` will handle the production optimization.

## 📄 License
Privately owned and developed for BrightPath Tuition Center.
