# 🧬 ExamOptiGA

> **An intelligent examination timetable scheduling and resource optimization platform powered by Genetic Algorithm.**

![Status](https://img.shields.io/badge/Status-Active-success)
![Domain](https://img.shields.io/badge/Domain-Artificial%20Intelligence-blue)
![Algorithm](https://img.shields.io/badge/Algorithm-Genetic%20Algorithm-purple)
![Frontend](https://img.shields.io/badge/Frontend-React%20%7C%20TypeScript-61DAFB)
![Styling](https://img.shields.io/badge/Styling-Tailwind%20CSS-06B6D4)
![Deployment](https://img.shields.io/badge/Deployment-Netlify-00C7B7)

---

## 🌐 Live Application

👉 **https://laliexamoptiga.netlify.app/**

---

## 📖 Overview

**ExamOptiGA** is a modern web-based examination scheduling and management platform designed to automate the generation of university examination timetables.

The system uses a **Genetic Algorithm (GA)** to optimize examination schedules while considering multiple constraints such as student strength, examination hall capacity, invigilator allocation, available time slots, and scheduling conflicts.

The platform provides a centralized dashboard for viewing examination schedules, hall allocation, invigilator assignments, seating arrangements, analytics, and optimization results.

---

## 🎓 Academic Information

| Category | Details |
|----------|---------|
| **Project Name** | ExamOptiGA |
| **Project Title** | University Examination Timetable Scheduler Using Genetic Algorithm |
| **College** | Velalar College of Engineering and Technology (Autonomous) |
| **Department** | Artificial Intelligence and Data Science |
| **Domain** | Artificial Intelligence |
| **Sub-Domain** | Optimization and Scheduling |
| **Core Algorithm** | Genetic Algorithm |
| **Application Type** | Web-Based Examination Management System |

---
## 🛠️ Technology Stack

| Category | Technology |
|----------|------------|
| **Frontend** | React |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **UI Components** | React Components |
| **Icons** | Lucide React |
| **Charts** | Recharts |
| **Optimization Algorithm** | Genetic Algorithm |
| **Backend / Processing** | Python |
| **Data Processing** | Pandas |
| **Numerical Computing** | NumPy |
| **Data Format** | CSV / Excel |
| **Build Tool** | Vite |
| **Version Control** | Git & GitHub |
| **Deployment** | Netlify |
---
## 📸 Project Screenshots

> A visual overview of the ExamOptiGA examination scheduling and optimization platform.

---

### 📊 Examination Control Dashboard

The central dashboard provides a real-time overview of examination statistics, resources, scheduling status, and Genetic Algorithm performance.

<img width="1902" height="1090" alt="Screenshot 2026-08-24 222833" src="https://github.com/user-attachments/assets/5352179d-30cb-417c-a13c-ba37b1b5a9db" />


---

### 📤 Examination Data Upload

Upload subject, student, examination hall, and invigilator datasets through the dedicated data management interface.

<img width="1900" height="1113" alt="Screenshot 2026-08-24 222851" src="https://github.com/user-attachments/assets/67ce7032-24f4-441a-9991-6d97911b0bc2" />


---

### 📅 Generated Examination Timetable

View the optimized examination timetable with subject, faculty, hall, examination day, time slot, and student information.

<img width="1892" height="1097" alt="Screenshot 2026-08-24 222904" src="https://github.com/user-attachments/assets/73fd581a-67b4-4044-9208-235bc122c3d5" />


---

### 🏫 Examination Hall Allocation

Monitor hall capacity, allocated students, remaining capacity, and hall utilization status.

<img width="1873" height="952" alt="Screenshot 2026-08-24 222917" src="https://github.com/user-attachments/assets/6645aed4-3d89-483e-8786-4e4ff2ac0df4" />


---

### 📑 Reports & Export

Generate and manage examination reports including timetable, hall allocation, invigilator allocation, seating arrangement, and fitness reports.

<img width="1882" height="1063" alt="Screenshot 2026-08-24 222929" src="https://github.com/user-attachments/assets/22a7f2cd-e181-403b-a608-8fff76ca8898" />


---

### 🧬 Genetic Algorithm Optimization

Monitor Genetic Algorithm parameters, fitness score, optimization progress, and the evolution of the examination schedule.

<img width="1899" height="1065" alt="Screenshot 2026-08-24 222944" src="https://github.com/user-attachments/assets/3e8df70d-c88e-4853-ab08-6a52d03a14b2" />


---
## ✨ Key Features

### 📊 Intelligent Examination Dashboard

- Real-time examination statistics
- Subject and student overview
- Invigilator and hall availability
- Time-slot monitoring
- Fitness score visualization
- Interactive scheduling analytics
- Centralized examination management

### 🧬 Genetic Algorithm Optimization

- Automated timetable optimization
- Chromosome-based schedule representation
- Fitness-based solution evaluation
- Selection and crossover operations
- Mutation and elitism strategies
- Constraint-aware scheduling
- Conflict minimization
- Best-schedule generation

### 📅 Automated Examination Timetable

- Subject and faculty assignment
- Student strength management
- Examination hall assignment
- Day and time-slot allocation
- Structured timetable generation
- CSV and Excel export support

### 🏫 Intelligent Hall Allocation

- Capacity-aware hall assignment
- Student-to-hall allocation
- Hall utilization monitoring
- Remaining-capacity calculation
- Availability and overload status
- Resource utilization analysis

### 👨‍🏫 Invigilator Management

- Faculty invigilator assignment
- Hall-wise duty allocation
- Subject-wise assignment
- Examination day scheduling
- Time-slot allocation
- Workload visibility

### 🪑 Automated Seating Arrangement

- Hall-wise student allocation
- Structured seating grid
- Student seat identification
- Capacity-based seating
- Organized examination hall layouts

### 📈 Analytics & Visualization

- Students-per-subject analysis
- Hall capacity utilization
- Examination distribution by day
- Invigilator allocation analytics
- Genetic Algorithm fitness evolution
- Schedule performance monitoring

### 📑 Examination Reports

- Timetable reports
- Hall allocation reports
- Invigilator reports
- Seating arrangement reports
- Fitness evaluation reports
- CSV, Excel, and PDF export options

### 📤 Flexible Data Management

- Subject and student CSV upload
- Examination hall CSV upload
- Invigilator CSV upload
- Examination window configuration
- Structured input-data validation
---

## 📂 Project Structure

```text
ExamOptiGA/
│
├── public/
│   ├── favicon.ico
│   └── assets/
│
├── src/
│   ├── components/
│   │   ├── dashboard/
│   │   ├── upload/
│   │   ├── timetable/
│   │   ├── halls/
│   │   ├── invigilators/
│   │   ├── seating/
│   │   ├── genetic-algorithm/
│   │   └── reports/
│   │
│   ├── data/
│   ├── services/
│   ├── utils/
│   ├── hooks/
│   ├── types/
│   ├── assets/
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── docs/
│
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── README.md
└── LICENSE
```

---

## 🎯 Project Highlights

- Genetic Algorithm Based Scheduling
- Automated Examination Timetable
- Intelligent Hall & Invigilator Allocation
- Automated Seating Arrangement
- Interactive Analytics Dashboard
- Fitness & Conflict Evaluation
- CSV, Excel & PDF Reports
- Responsive Professional UI

---

## 🚀 Future Enhancements

- Real-Time GA Optimization
- Advanced Conflict Detection
- Multi-Department Scheduling
- AI-Assisted Timetable Generation
- Advanced Analytics
- Cloud-Based Management
- Mobile Application Support

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Developer

**Lalith Krish**

**AI & Data Science Engineer**

📧 **Email:**  
lalithkrish2006@gmail.com

💼 **LinkedIn:**  
https://www.linkedin.com/in/lalithkrish-data

🐙 **GitHub:**  
https://github.com/Lalithkrish06

---

### ⭐ If you found this project useful, consider giving it a Star.ul, consider giving it a Star.
