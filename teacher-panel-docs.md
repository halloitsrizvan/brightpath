# Teacher Panel Documentation

## Overview
The Teacher Panel (Faculty Hub) provides tutors with the necessary tools to log their teaching hours, track student progress, and monitor their own financial incentives.

## Core Features & Modules

### 1. Faculty Dashboard (`/teacher-dashboard`)
- **Key Metrics:** Displays assigned students, classes conducted this month, total hours logged, and an estimated salary for the current month.
- **Quick Actions:** Prominent "Mark Attendance" button for fast access to core functionality.

### 2. Attendance & Session Logging (`/teacher-dashboard/attendance`)
- **Process:** Teachers select an assigned student, subject, and specify the duration of the class (in minutes), along with a status (Present/Absent).
- **Snapshot Logic:** When attendance is logged, the system captures the *current* `billRateAtTime` and `salaryRateAtTime` from the student's assignment record. This snapshot ensures that if rates change in the future, past attendance records retain the correct historical financial value for payroll and invoicing calculations.

### 3. Exam Management (`/teacher-dashboard/exams`)
- **Data Entry:** Teachers can input exam marks, total marks, and text-based feedback for their assigned students.
- **Impact:** This data feeds directly into the Student Panel's Academic Performance trackers and the Admin's Monthly Reports.

### 4. Incentive & Performance Tracking
- **Incentive Progress (`IncentiveProgressCard.tsx`):** Displays real-time progress against targets set by the Admin.
- **Logic:** Compares the teacher's accumulated hours for the month (derived from Attendance records) against the `targetHours` defined in active `IncentiveRules`. Shows a progress bar motivating the teacher to hit the required hours for the bonus payout.
