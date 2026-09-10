# BrightPath Eduvora - Public Pages Content & Structure Documentation

This document provides a comprehensive breakdown of all public-facing pages in the BrightPath Eduvora application. It outlines the route structure, page titles, SEO metadata, layout components, sections, copy, interactive elements, and forms.

---

## Table of Contents
1. [Global Layout & Shared Components](#global-layout--shared-components)
2. [1. Home Page (`/`)](#1-home-page-)
3. [2. About Us (`/about`)](#2-about-us-about)
4. [3. Services (`/services`)](#3-services-services)
5. [4. Our System (`/our-system`)](#4-our-system-our-system)
6. [5. Curriculum (`/curriculum`)](#5-curriculum-curriculum)
7. [6. Academic Boards (`/boards`)](#6-academic-boards-boards)
8. [7. Subjects We Teach (`/subjects`)](#7-subjects-we-teach-subjects)
9. [8. Dynamic Tuition Pages (`/tuition/[category]/[slug]`)](#8-dynamic-tuition-pages-tuitioncategoryslug)
   - [A. Classes & Subject Variant](#a-classes--subject-variant)
   - [B. Location-Specific Variant](#b-location-specific-variant)
10. [9. Expert Tutors (`/tutors`)](#9-expert-tutors-tutors)
11. [10. Success Stories & Testimonials (`/testimonials`)](#10-success-stories--testimonials-testimonials)
12. [11. Become a Tutor (`/become-tutor`)](#11-become-a-tutor-become-tutor)
13. [12. Careers (`/careers`)](#12-careers-careers)
14. [13. Academic Downloads (`/downloads`)](#13-academic-downloads-downloads)
15. [14. Academy Journal / Blog (`/blog`)](#14-academy-journal--blog-blog)
16. [15. Single Blog Article (`/blog/[slug]`)](#15-single-blog-article-blogslug)
17. [16. Contact & Diagnostic Enquiry (`/contact`)](#16-contact--diagnostic-enquiry-contact)
18. [17. Privacy Policy (`/privacy`)](#17-privacy-policy-privacy)
19. [18. Terms of Service (`/terms`)](#18-terms-of-service-terms)

---

## Global Layout & Shared Components

### 1. Public Navbar (`PublicNavbar`)
- **Brand Identity**: BrightPath Eduvora Logo and title.
- **Main Nav Items**:
  - `Home` (`/`)
  - `Online Tuition` (Nested Multi-level Dropdown):
    - **Tuition By Classes**: Class 1-5 (Sub-levels: Class 1, 2, 3, 4, 5), Class 6, Class 7, Class 8, Class 9, Class 10, Class 11, Class 12
    - **Tuition By Location**: Kerala, Dubai(UAE), Qatar, Chennai, Bangalore, Coimbatore, Hyderabad
    - **Tuition By Subject**: English, Maths, Science, Social Science, Malayalam, Hindi, Physics, Chemistry, Biology
    - **Tuition By Board**: CBSE, ICSE, State, IGCSE
  - `Become a Tutor` (`/become-tutor`)
  - `About Us` (`/about`)
  - `More` (Dropdown): Our System (`/our-system`), Testimonials (`/testimonials`), Blogs (`/blog`), Contact (`/contact`)
- **Action Button**: `Book a Demo` (Triggers `DemoModal`).
- **Mobile Menu**: Responsive full-screen slide-down with expandable accordion groups for all tuition routes and quick links.

### 2. Public Footer (`PublicFooter`)
- **Brand Column**: Logo, slogan ("Kerala's leading one-on-one online tuition academy"), mission statement, and social media handles (Instagram, LinkedIn, Twitter).
- **Academic Programs**: Primary (1-5), Secondary (6-10), Higher Secondary, Subject Specialists, Competitive Exams.
- **Academy Links**: Our Philosophy, Expert Mentors, Success Stories, Academy Blog, Support Center.
- **Headquarters & Contact**:
  - Address: Calicut, Kerala, India - 673001
  - Phone / WhatsApp: +91 85908 78148
- **Footer Bottom Bar**:
  - Copyright: `© 2026 BRIGHTPATH KERALA | ACADEMIC CORE`
  - Legal Links: Privacy Policies (`/privacy`), Usage Terms (`/terms`)
  - Rating Badge: `Kerala's #1 Rated Online Academy ★ 4.9/5`

### 3. Floating Contact (`FloatingContact`)
- Fixed floating widget on bottom-right for instant WhatsApp direct connect to academic counsellors (+91 85908 78148).

### 4. Book Free Demo Modal (`DemoModal`)
- Modal popup for quick lead capture across all pages.
- Fields: Student Name, Parent Name, Phone, Email, Grade/Class, Preferred Subject, Academic Board.

---

## 1. Home Page (`/`)
- **File**: `src/app/page.tsx` & `src/app/HomeClient.tsx`
- **Route**: `/`
- **Primary Goal**: Conversion and lead generation, showcasing 1:1 online mentorship value proposition.

### Sections & Content:
1. **Structured Data (JSON-LD)**: Schema.org `EducationalOrganization` metadata.
2. **Hero Section**:
   - Tag: `Kerala's #1 Mentorship Academy`
   - Heading: `Learn Right. Grow Bright.`
   - Description: "Premium 1:1 online mentorship for students from KG to 12th Grade. Experience the future of personalized education with Kerala's most trusted tutors."
   - CTA: `Book Free Assessment` (Opens Demo Modal)
   - Visual: Rotating hero banner cards with live badge `1:1 Mentorship Session`.
3. **Banner Carousel**:
   - Auto-sliding high-resolution promotional banners with interactive navigation dots and controls.
4. **The Academy Edge (Feature Highlights)**:
   - Heading: `Educational Clarity Redefined.`
   - Impact Points:
     - Localized instruction in Malayalam & English
     - Monthly progress analytical reports
   - Feature Grid:
     - `Flexible Timing`: Classes from 5 AM to 11 PM
     - `1:1 Mentorship`: Personalized focus
     - `Trusted Tutors`: Verified expertise
     - `KG - 12 Coverage`: All boards supported
5. **Academic Modules (`SubjectsGrid`)**:
   - Cards with custom artwork for Mathematics, Physics, Chemistry, Biology, English, Social Studies.
6. **Student & Parent Testimonials (`Testimonials`)**:
   - Authentic Malayalam and English testimonials from parents.
7. **Frequently Asked Questions (`PublicFAQ`)**:
   - Collapsible accordion with top 5 questions regarding boards, 1:1 format, class timings, and reports.
8. **Personalized Education Features (`PublicFeatures`)**:
   - 6 Core Pillars: Individualized Plans, Transparent Pricing, Weak Area Focus, Board-Specific Support, Anytime Mentor Support, Holistic Monitoring.

---

## 2. About Us (`/about`)
- **File**: `src/app/about/page.tsx`
- **Route**: `/about`
- **Metadata**: Title: "About Us" | Description: "Kerala's premier 1:1 online tuition academy. Learn about our vision, mission, core values, and dedicated academic mentorship ecosystem."

### Sections & Content:
1. **Hero Header**:
   - Badge: `Our Institutional DNA`
   - Heading: `Learn Right. Grow Bright.`
   - Subtitle: "Brightpath Kerala is more than an academy—it’s a commitment to the cognitive evolution of every student who joins our ecosystem."
2. **Mission & Vision Cards**:
   - **Our Mission**: "To democratize elite 1:1 mentorship across Kerala, ensuring geography never limits a child's academic potential through digital innovation."
   - **Our Vision**: "Setting the global benchmark for personalized online pedagogy by creating a high-transparency ecosystem where growth is absolute."
3. **Institutional Values (The Ethical Registry)**:
   - `Integrity`: Radical honesty in every report and academic assessment delivered to parents.
   - `Empathy`: Understanding the student's unique pace and emotional learning needs first.
   - `Innovation`: Evolving our digital tools daily to keep learning interactive and fast-paced.
   - `Excellence`: A relentless pursuit of academic mastery for every student in our care.
4. **The Academy In Numbers (Milestones)**:
   - `12+` Years of Excellence
   - `5000+` Successful Alumni
   - `500+` Expert Mentors
   - `99%` Student Satisfaction

---

## 3. Services (`/services`)
- **File**: `src/app/services/page.tsx` & `src/components/public/ServicesSection.tsx`
- **Route**: `/services`
- **Metadata**: Title: "Our Services" | Description: "Premium 1:1 online tuition, entrance exam prep (JEE/NEET), language foundation courses, and personalized academic counseling."

### Sections & Content:
1. **Hero Section**:
   - Badge: `Operational Excellence`
   - Heading: `The Mentorship Solution.`
   - Description: "Precision-engineered educational services designed for the modern KG-12 student in Kerala."
2. **Benefit Indicators**:
   - `Live 1:1 Sessions`
   - `Flexible Node`
   - `Secure Digital Hub`
   - `Growth Analytics`
3. **Core Deliverables (Services Grid)**:
   - `1:1 Digital Mentorship`: Personalized online classes focused purely on the individual student's learning trajectory.
   - `Academic Analysis`: Regular diagnostic testing and monthly analytical reports to track core comprehension.
   - `Entrance Specialization`: Focused coaching for SSLC, CBSE, ICSE boards and medical/engineering entry corridors.
   - `Security Verified`: A strictly audited digital learning ecosystem with background-verified professional tutors.
4. **Enrollment CTA Banner**:
   - Heading: `Ready to Elevate Your Learning Velocity?`
   - Action: `Request Enrollment Flight`

---

## 4. Our System (`/our-system`)
- **File**: `src/app/our-system/page.tsx`
- **Route**: `/our-system`
- **Metadata**: Title: "Our System" | Description: "Explore the Brightpath digital ecosystem. Real-time progress tracking, task management, and structured 1:1 online classrooms."

### Sections & Content:
1. **Hero Header**:
   - Badge: `System Overview`
   - Heading: `Brightpath Ecosystem.`
   - Description: "A specialized digital infrastructure providing complete transparency and efficiency for students, parents, and mentors."
2. **Integrated Systems Grid**:
   - **Student & Parent Portal**:
     - Description: Maximum visibility into the academic journey.
     - Features:
       - `Progress Tracking`: View real-time academic growth and performance matrices.
       - `Task Management`: Direct access to assignments and submitted projects.
       - `Smart Scheduling`: Interactive calendar with automated class reminders.
   - **Professional Teacher Portal**:
     - Description: Empowers mentors with specialized tools for administrative and academic management.
     - Features:
       - `Attendance Registry`: One-click attendance tracking for every academic session.
       - `Salary Management`: Financial transparency with real-time earnings tracking.
       - `Digital Classroom`: Integrated tools for seamless online instruction delivery.

---

## 5. Curriculum (`/curriculum`)
- **File**: `src/app/curriculum/page.tsx`
- **Route**: `/curriculum`
- **Metadata**: Title: "Curriculum" | Description: "Precision-engineered academic syllabus structures for KG to 12th grade across CBSE, ICSE, and Kerala State boards."

### Sections & Content:
1. **Hero Header**:
   - Badge: `Academic Architecture`
   - Heading: `The Curriculum Spectrum.`
   - Description: "Precision-engineered learning tracks for Kerala State, CBSE, and ICSE boards, covering foundational years through entrance specialization."
2. **Board Badges**:
   - Kerala State Board, CBSE Portfolio, ICSE Certification.
3. **Level Breakdown**:
   - **KG - 5: Foundational Nucleus**:
     - Focus: Phonetics, basic logic, creative expression through 1:1 interaction.
     - Modules: Creative Storytelling, Mathematical Logic Base, Language Fluency, EVS Exploration.
   - **6 - 10: Core Analytical Hub**:
     - Focus: Strategic mentorship for competitive state and national curriculums. Deep-diving into STEM and Humanities.
     - Modules: Advanced Mathematics, Physical Sciences, Biological Inquiries, Social Dynamics.
   - **11 - 12: Higher Specialization**:
     - Focus: Intensive training for entrance corridors including NEET and JEE, alongside board exam excellence.
     - Modules: Physics Analytics, Chemical Synthesis, Advanced Calculus, Economic Frameworks.

---

## 6. Academic Boards (`/boards`)
- **File**: `src/app/boards/page.tsx`
- **Route**: `/boards`
- **Metadata**: Title: "Academic Boards" | Description: "Personalized 1:1 tuition for CBSE, ICSE, ISC, IGCSE, and Kerala State Board curriculums. Tailored preparation for every syllabus."

### Sections & Content:
1. **Hero Section**:
   - Badge: `Curriculum Expertise`
   - Heading: `Academic Boards.`
   - Description: "We specialize in all major national and international academic boards, providing tailored mentorship for every syllabus."
2. **Boards Grid**:
   - `CBSE`: Comprehensive coverage of NCERT curriculum with focus on conceptual clarity and competitive exam foundation.
   - `ICSE/ISC`: Detailed pedagogical approach focusing on language proficiency and analytical skills.
   - `Kerala State`: Specialized support for SCERT syllabus, ensuring students excel in board examinations with local expertise.
   - `IGCSE`: International standards of learning with focus on global perspective and practical application.
   - Key Feature: `Specialized Mentors Available` for all 4 boards.

---

## 7. Subjects We Teach (`/subjects`)
- **File**: `src/app/subjects/page.tsx`
- **Route**: `/subjects`
- **Metadata**: Title: "Subjects We Teach" | Description: "Specialized 1:1 tutoring across Mathematics, Physics, Chemistry, Biology, English, Malayalam, and more for KG-12 students."

### Sections & Content:
1. **Hero Header**:
   - Badge: `Academic Depth`
   - Heading: `The Curriculum Spectrum.`
   - Description: "Comprehensive subject coverage ranging from foundational literacy in Grade 1 to advanced board specializations in Grade 12."
2. **Curriculum Feature Chips**:
   - Kerala State Syllabus, CBSE / ICSE Mastery, English & Malayalam Tracks, Entrance Integration.
3. **Subjects Grid (`SubjectsGrid`)**:
   - Mathematics, Physics, Chemistry, Biology, English, Social Studies.
4. **Diagnostic Mapping Banner**:
   - Heading: `Diagnostic Mapping`
   - Copy: "Not sure which subject focus is right for your child? Our institutional diagnostic mapping helps identify core cognitive gaps before enrollment."
   - CTA: `Start Mapping Free`

---

## 8. Dynamic Tuition Pages (`/tuition/[category]/[slug]`)
- **Files**: `src/app/tuition/[category]/[slug]/page.tsx` & `TuitionPageClient.tsx`
- **Dynamic Categories**: `tuition-by-classes`, `tuition-by-location`, `tuition-by-subject`, `tuition-by-board`

### A. Classes & Subject Variant (e.g., `/tuition/tuition-by-classes/class-10`)
1. **Hero Section with Integrated Lead Form**:
   - Heading: `Master [Class/Subject] with Kerala's Elite.`
   - Highlights: `100% 1:1 Focus`, `Individual Roadmap`.
   - **Interactive Booking Form**:
     - Role Selector (Parent / Student), Board (CBSE / ICSE / State / IGCSE), Student Name, Parent Name, Email, Phone (+91), WhatsApp Number.
     - Submission sends lead directly to `/api/public-enquiries`.
2. **The Success Formula**:
   - `Goal Oriented`: Aligning every session with specific academic milestones.
   - `Live Interaction`: Real-time face-to-face mentorship.
   - `Elite Pedagogy`: Research-backed and result-driven teaching methods.
3. **Why Choose Brightpath for [Class/Subject]**:
   - 1:1 Exclusivity, Verified Experts, Extreme Flexibility, Custom Curriculum.
4. **Problems We Solve for [Class/Subject] Students**:
   - Learning Anxiety, Lack of Foundation, Exam Strategy, Parental Worry.
5. **How Our [Class/Subject] Tuition Works (4-Step Workflow)**:
   - `01 Free Assessment`: Evaluating current level and learning requirements.
   - `02 Mentor Pairing`: Matching with the perfect subject specialist.
   - `03 Custom Roadmap`: Creating a tailored curriculum targeting weak areas.
   - `04 Mastery & Growth`: 1:1 sessions with continuous monitoring and reports.

### B. Location-Specific Variant (e.g., `/tuition/tuition-by-location/kerala`, `/tuition/tuition-by-location/dubai`)
1. **Location Hero Banner**:
   - Background image with local educational branding.
   - Heading: `Best Online Tuition in [Location] – One-on-One Classes for CBSE, ICSE & State Boards`
   - Action: `Book Free Demo` (Smooth scrolls to enquiry form).
2. **Best Online Tuition Services in [Location]**:
   - `High Quality Courses`: Deep, practical knowledge.
   - `Individualized Online Class`: Tailored to each student's pace.
   - `Blended Model of Online Tutoring`: Live sessions + digital materials.
3. **Local Educational Promise**:
   - "Online Tuition in [Location] That Truly Works for Every Student."
4. **Why Online Tuition is Becoming Popular in [Location]**:
   - No travel; learn from home.
   - Flexible morning/evening timing.
   - 1:1 attention improves academic outcomes.
   - Access to top educators across India.
5. **7-Point Deep Dive (What Makes Brightpath the Best in [Location])**:
   - 01 One-on-One Personal Attention
   - 02 Customized Learning Plan
   - 03 Building Confidence & Academic Growth
   - 04 Covers All Syllabus (CBSE, State, ICSE, IGCSE)
   - 05 Flexible Timings
   - 06 Regular Tests & Progress Tracking
   - 07 Complete Study Materials

---

## 9. Expert Tutors (`/tutors`)
- **File**: `src/app/tutors/page.tsx` & `src/features/teachers/components/PublicTutorsGrid.tsx`
- **Route**: `/tutors`
- **Metadata**: Title: "Expert Tutors" | Description: "Meet our strictly audited roster of professional 1:1 tutors, including postgraduate and PhD subject-matter experts in Kerala."

### Sections & Content:
1. **Hero Section**:
   - Badge: `The Faculty Hub`
   - Heading: `Our Expert Mentors.`
   - Description: "A strictly audited roster of professional educators dedicated to your child's 1:1 academic trajectory."
2. **Faculty Standards**:
   - `Strict Verification`: 100% background-verified faculty.
   - `Expertise Led`: Subject-matter specialization only.
   - `Advanced Credentials`: Post-graduate & PhD profile focus.
3. **Public Tutors Grid (`PublicTutorsGrid`)**:
   - Live roster loaded directly from database (`/api/teachers`).
   - Displays mentor profiles, subject specializations, qualifications, and experience.
4. **Faculty Recruitment CTA**:
   - Heading: `Join Our Faculty Network?`
   - Subtitle: "We are always looking for passionate 1:1 mentors to join Kerala's most trusted recruitment portal."
   - Action: `Submit Portfolio`

---

## 10. Success Stories & Testimonials (`/testimonials`)
- **File**: `src/app/testimonials/page.tsx` & `TestimonialsClient.tsx`
- **Route**: `/testimonials`
- **Metadata**: Title: "Success Stories" | Description: "Read testimonials from families, parents, and students who have transformed their grades and confidence with BrightPath online tuition."

### Sections & Content:
1. **Hero Header**:
   - Badge: `Voices of Success`
   - Heading: `Success Stories.`
   - Description: "Join thousands of families across Kerala and the GCC who have transformed their academic journey with Brightpath."
2. **Testimonials Grid**:
   - Authenticated reviews from parents with star ratings:
     - **Hashim (Parent)**: Feedback on rapid improvement in daughter's English reading fluency and friendly mentor support.
     - **Abdul Salam (Parent)**: Transformation in foundational English comprehension and confidence.
     - **Shameer (Parent)**: Remarkable progress in Malayalam 20-day foundation course.
3. **Success Metrics**:
   - `5000+` Happy Families
   - `99%` Success Rate
   - `100%` Verified Tutors
   - `4.9/5` Average Rating
4. **Conversion CTA**:
   - Heading: `Ready To Be Our Next Success Story?`
   - Action: `Book A Free Demo`

---

## 11. Become a Tutor (`/become-tutor`)
- **File**: `src/app/become-tutor/page.tsx`
- **Route**: `/become-tutor`
- **Metadata**: Title: "Become a Tutor" | Description: "Join Kerala's fastest-growing 1:1 online mentorship network. Flexible hours, competitive pay, and global teaching opportunities from home."

### Sections & Content:
1. **Hero Section**:
   - Badge: `Recruitment Drive 2026`
   - Heading: `Online Teaching Job In Kerala! Join BrightPath As A Tutor.`
   - Subtitle: "Transform lives from the comfort of your home. We are looking for passionate educators to join India's fastest-growing 1:1 online mentorship network."
   - CTA: `Apply via WhatsApp` (Direct deep link to recruitment team).
2. **Why Teach With BrightPath**:
   - `Zero Travel`: Work from anywhere, saving daily commute time.
   - `Rewarding Pay`: Competitive compensation respecting academic expertise.
   - `Global Platform`: Teach students across India and the GCC.
3. **Teacher Onboarding Journey (4 Steps)**:
   - `Instant WhatsApp Connect`: Quick initial conversation.
   - `Skill Evaluation`: Subject knowledge and communication style check.
   - `Onboarding`: Training on 1:1 pedagogical framework.
   - `Start Mentoring`: Student pairing and session kickoff.
4. **Why Join Us Checklist**:
   - Flexible Timings, Mentorship Training, Creative Autonomy, Tech Support 24/7, Performance Bonuses, Professional Growth.
5. **Qualifying Criteria**:
   - Academic Proficiency (CBSE, ICSE, State boards).
   - Bilingual Communication (English & Malayalam).
   - Digital Literacy (Whiteboards & meeting tools).
   - Passion for student growth.

---

## 12. Careers (`/careers`)
- **File**: `src/app/careers/page.tsx`
- **Route**: `/careers`
- **Metadata**: Title: "Careers" | Description: "Explore career opportunities at BrightPath. Join our talent pool of passionate educators and academic consultants in Kerala."

### Sections & Content:
1. **Hero Header**:
   - Badge: `Join Our Academic Core`
   - Heading: `Careers at BrightPath.`
   - Description: "We are always looking for passionate educators and innovators to join Kerala's most advanced 1:1 tuition ecosystem."
2. **Future Opportunities**:
   - Open Talent Pool statement.
   - Call to submit resumes for roles across teaching, academic sales, curriculum design, and tech operations.
   - CTA: `Contact Careers` (mailto link: `careers@brightpatheduvora.com`).

---

## 13. Academic Downloads (`/downloads`)
- **File**: `src/app/downloads/page.tsx`
- **Route**: `/downloads`
- **Metadata**: Title: "Academic Downloads" | Description: "Access BrightPath study materials, brochures, and curriculum guidelines. Secure repository for registered students and tutors."

### Sections & Content:
1. **Hero Header**:
   - Badge: `Resources & Material`
   - Heading: `Academic Downloads.`
   - Description: "Access study materials, brochures, and curriculum guides from our academic repository."
2. **Secure Repository Notice**:
   - Institutional portal protection notice.
   - Actions:
     - `Student Login` (Redirects to `/student-dashboard`)
     - `Request Brochure` (Redirects to `/contact`)

---

## 14. Academy Journal / Blog (`/blog`)
- **File**: `src/app/blog/page.tsx`
- **Route**: `/blog`
- **Metadata**: Title: "Academy Journal | BrightPath Eduvora" | Description: "Expert academic insights, study guides, and institutional updates from Kerala's premier 1:1 online academy."

### Sections & Content:
1. **Hero Header**:
   - Badge: `Academic Insight`
   - Heading: `The Brightpath Journal.`
   - Description: "Thought leadership, study guides, and institutional updates from Kerala's premier online academy."
2. **Blog Posts Grid**:
   - Dynamic cards fetching live published articles from MongoDB.
   - Each card contains: Article thumbnail image, Category badge, Publication date, Author name, Article Title, Short excerpt, `Read Full Narrative` hover button.

---

## 15. Single Blog Article (`/blog/[slug]`)
- **File**: `src/app/blog/[slug]/page.tsx`
- **Route**: `/blog/[slug]`
- **Metadata**: Dynamic OpenGraph & Meta Title based on post SEO settings.

### Sections & Content:
1. **Header Navigation**:
   - `Return to Journal` (`/blog`) back link.
   - Category badge & Formatted Date.
   - Article H1 Title.
   - Author Avatar and "Written By" metadata.
2. **Article Content Area**:
   - Full HTML rendered article formatted via Tailwind typography (`prose prose-xl prose-primary`).
   - Includes embedded graphics, headers, bullet points, and quotes.

---

## 16. Contact & Diagnostic Enquiry (`/contact`)
- **File**: `src/app/contact/page.tsx` & `ContactClient.tsx`
- **Route**: `/contact`
- **Metadata**: Title: "Contact Us" | Description: "Request a free 1:1 diagnostic demo session or get in touch with our academic advisors. Start your academic transformation today."

### Sections & Content:
1. **Hero Header**:
   - Badge: `Lead Generation Hub`
   - Heading: `Enquiry Portal.`
   - Description: "Ready to begin your academic transformation? Connect with our institutional advisors for a personalized diagnostic session."
2. **Contact Coordinates**:
   - `Institutional Hotline`: +91 85908 78148
   - `Email Dispatch`: enquiry@brightpath.eduvora
   - `Operational Node`: Brightpath Kerala | Online Academy
   - `Active Hours`: Mon - Sat: 5:00 AM - 11:30 PM | Sunday: Revision Only
3. **Diagnostic Request Form**:
   - Fields:
     - Parent/Guardian Name
     - Contact Identifier (Phone/WhatsApp)
     - Academic Module / Grade (e.g., 10th Grade CBSE Physics)
     - Learning Requirements / Specific Challenges
   - Submission: Records enquiry in database and auto-opens WhatsApp with formatted message payload.

---

## 17. Privacy Policy (`/privacy`)
- **File**: `src/app/privacy/page.tsx`
- **Route**: `/privacy`
- **Metadata**: Title: "Privacy Policy" | Description: "Read the privacy policy of BrightPath Eduvora. Learn how we handle and protect student, parent, and tutor data."

### Sections & Content:
1. **Hero Header**:
   - Badge: `Institutional Registry`
   - Heading: `Privacy Policy.`
   - Last Updated date: April 2026.
2. **Policy Sections**:
   - `Introduction`: Overview of privacy commitments for students and parents.
   - `Information We Collect`: Student names, contact details, grades, boards.
   - `Data Security`: Encryption standards, zero-sale guarantee, authorized access control.
   - `Usage of Data`: Personalization, reports, scheduling, technical support.
   - `Questions & Compliance`: Contact details for Privacy Officer (`legal@brightpatheduvora.com`).

---

## 18. Terms of Service (`/terms`)
- **File**: `src/app/terms/page.tsx`
- **Route**: `/terms`
- **Metadata**: Title: "Terms of Service" | Description: "Read the terms of service for the BrightPath Eduvora website, online tuition platform, and mentorship ecosystem."

### Sections & Content:
1. **Hero Header**:
   - Badge: `Governance Framework`
   - Heading: `Usage Terms.`
   - Last Updated date: April 2026.
2. **Terms Sections**:
   - `Acceptance of Terms`: Legal binding agreement for users and visitors.
   - `Services Provided`: Scope of individualized online tutoring services.
   - `User Responsibilities`: Learning environment, device connection, code of conduct for respectful sessions.
   - `Limitation of Liability`: Legal disclaimers and maximum liability limits.
   - `Institutional Governance`: Download link for enterprise agreements.
