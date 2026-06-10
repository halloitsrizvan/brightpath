# Student Panel Documentation

## Overview
The Student Panel (Student Hub) provides learners with transparency regarding their academic progress, schedule, and financial obligations to the institution.

## Core Features & Modules

### 1. Student Dashboard (`/student-dashboard`)
- **Key Metrics:** Displays the number of enrolled modules (subjects), active tutors, and total sessions attended.
- **Learning Velocity Chart:** An area chart showing the daily hours of study/attendance logged over the current month.
- **Support Portal:** Quick links to contact institutional support for academic or scheduling issues.

### 2. Academic Performance (`/student-dashboard/performance`)
- **Exam Results:** Allows students to view their historical exam marks entered by their teachers.
- **Analytics:** (In development per `todo.md`) Will feature improvement comparison metrics indicating areas where the student is excelling or needs improvement.

### 3. Attendance Records (`/student-dashboard/attendance`)
- **History:** A detailed log of all classes attended, including the date, subject, teacher, and duration.
- **Verification:** Allows the student to verify that the hours logged by the teacher match their actual sessions.

### 4. Financials & Billing
- **Pending Bills:** Displays the total fee amount due for the current/past months.
- **Calculation Logic:** Relies on the Admin's `finance-sync.ts`. Bills are generated based on the total hours attended multiplied by the specific `billPerHour` rate assigned to that student for that specific subject.
- **Reminders:** (In development per `todo.md`) Automated reminders for unpaid fee records.
