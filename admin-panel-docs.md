# Admin Panel Documentation

## Overview
The Admin Panel serves as the "Executive Command Center" for BrightPath. It is a comprehensive dashboard allowing administrators to oversee operations, finance, academic records, personnel, and institutional targets. Below is a detailed breakdown of every page/module within the Admin Panel.

---

## Detailed Pages Breakdown

### 1. Executive Dashboard (`/admin-dashboard`)
The landing page of the Admin Panel, providing a high-level summary of the institution's health.
- **Key Metrics:** Displays Active Enrollments, Academic Staff counts, total Classes this month, and Monthly Income.
- **Strategic Insights (Operational Velocity):** A Recharts Area chart that visualizes teaching hours per day over the current month, compared directly to the previous month's performance.
- **Activity Ledger (Live Feed):** A real-time scrolling list of the most recent attendance logs (sessions) submitted by teachers across the institution.

### 2. Finance Hub (`/admin-dashboard/finance`)
The core financial engine handling automated billing and payroll disbursements.
- **Pending AR (Accounts Receivable):** Lists all unpaid student fee bills grouped by month. Admins can select individual or multiple records to "Batch Settle" and generate PDF invoices.
- **Tutor Payrolls:** Lists all unpaid salary records for teachers grouped by month. Admins can initiate "Batch Disbursements" to mark them as paid and generate payslips.
- **Paid Bills & History:** Displays a historical ledger of all settled transactions.
- **Economic Summary:** Visualizes Total Received Amount against Receivable, Total Salary Paid against Payable, Operational Expenses, and Realized Profit Margin.
- **Background Logic (`finance-sync.ts`):** Calculates fees/salaries based on attendance hours logged multiplied by specific rates. Freezes records once marked as 'paid' to prevent accidental overwrites.

### 3. Student Registry (`/admin-dashboard/students`)
The Academic Cohort Management hub.
- **Registry:** Lists all active students, their emails, and status.
- **Operations:** Admins can Add, View, Edit, or Delete student profiles.
- **Subject Assignment:** Within a student's profile, admins can assign specific Subjects and Teachers. Crucially, they set the specific `billPerHour` and `salaryPerHour` for that specific triad, which drives the financial calculations.

### 4. Teachers Portal (`/admin-dashboard/teachers`)
The Faculty and Payroll Registry.
- **Registry:** Lists all teachers, their emails, and base Salary Rates.
- **Operations:** Admins can Add, Edit, or Delete teacher profiles and adjust their base hourly pay.

### 5. Administrative Core & Founders (`/admin-dashboard/founders`)
Live economic directory of the core admin team/trustees.
- **Admin Core:** Lists all admin profiles, their base salary tier, and any outstanding principal debt to the institution.
- **Debt Management:** Admins can log "Debt" taken by an admin (which adds to their liability) or "Return" (which deducts from it).
- **Audit Trail:** A historical log of all capital flows (debts and returns) with reasons/justifications for institutional transparency.

### 6. Monthly Analytics & Reports (`/admin-dashboard/reports`)
Comprehensive performance audit generator.
- **Summary Visuals:** Displays Revenue, Net Operating Margin (Profit/Loss), Learning Intensity (Hours logged), and Average Exam Performance.
- **Teaching Distribution:** A Bar chart showing hours contributed by individual faculty members.
- **Detailed Ledgers:** Tabbed views allowing admins to review raw data for Financials (fees/salaries), Attendance (session logs), and Exams (scores).
- **Export Executive Summary:** Generates a full PDF dossier leveraging `pdf-lib` and `pdfkit` for the selected month's operations.

### 7. Attendance Registry (`/admin-dashboard/attendance`)
Global view of all class sessions.
- **Activity Log:** Displays every class logged by a teacher, detailing the Date, Student, Teacher, Subject, and Duration.
- **Purpose:** Acts as the source of truth for all billing and payroll calculations.

### 8. Exam Management (`/admin-dashboard/exams`)
Central review platform for academic performance.
- **Records:** Displays all exam marks entered by teachers.
- **Quality Audit:** Allows admins to monitor overall student scores, averages, and the frequency of assessments.

### 9. Operational Expenses (`/admin-dashboard/expenses`)
Tracking system for institutional overhead.
- **Expense Logging:** Admins can log daily/monthly costs such as Internet, Software Subscriptions, Marketing, Equipment, etc.
- **Impact:** Expenses logged here are directly deducted from the total revenue to calculate the Realized Profit Margin in the Finance Hub.

### 10. Incentives Config (`/admin-dashboard/incentives`)
Gamification and faculty motivation controls.
- **Rules Engine:** Admins create `IncentiveRules` defining a `targetHours` threshold and an `incentiveAmount`.
- **Logic:** If a teacher hits the target hours within a calendar month, the `finance-sync` automatically adds the bonus amount to their payroll.

### 11. Subjects Repository (`/admin-dashboard/subjects`)
The institutional curriculum database.
- **Management:** Admins can create and edit the list of subjects/modules offered by the tuition center, which are then used during Student assignment.

### 12. Leads Tracking (`/admin-dashboard/leads`)
CRM for prospective students.
- **Pipeline:** Tracks enquiries submitted through the public-facing website. Allows admins to follow up and convert prospects into enrolled students.

### 13. Internal Tasks (`/admin-dashboard/tasks`)
A specialized to-do list for administrative goals.
- **Task Management:** Allows the admin team to create, assign, and check off internal operational tasks to keep the core team aligned.
