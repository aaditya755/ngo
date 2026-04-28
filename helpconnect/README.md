# HelpConnect 🌱

![Next.js](https://img.shields.io/badge/Next.js-Fullstack-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-Enabled-blue?logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue?logo=postgresql)
![License](https://img.shields.io/badge/License-MIT-green)
![Status](https://img.shields.io/badge/Status-Active-success)

**NGO · Volunteer · Community Coordination Platform**

HelpConnect is a full-stack social impact platform built to improve how NGOs, volunteers, donors, and communities coordinate support.

It combines community need reporting, volunteer management, donation campaigns, emergency coordination, event scheduling, GIS mapping, and AI-powered allocation into a single platform.

---

## 📌 Table of Contents

- Overview  
- Problem Statement  
- Features  
- Tech Stack  
- Architecture  
- Installation  
- Environment Variables  
- User Roles  
- Project Structure  
- Future Scope  
- Team  
- Contributing  
- License  

---

# Overview

Many support systems fail not because resources do not exist, but because they are disconnected.

HelpConnect solves this by providing a digital coordination layer where:

- NGOs manage operations  
- Volunteers find and complete tasks  
- Field workers report needs  
- Donors support verified campaigns  
- Communities receive assistance faster  

The platform focuses on turning scattered help into coordinated action.

---

# Problem Statement

Traditional NGO and volunteer workflows often face:

- Delayed communication  
- Poor resource coordination  
- Manual volunteer assignment  
- Limited donation transparency  
- No centralized emergency management  
- Weak impact tracking systems  

HelpConnect was built to address these gaps.

---

# ✨ Features

## Community Needs Management
- Create and manage support requests  
- Severity and urgency prioritization  
- Zone-based need tracking  
- Volunteer assignment workflows

## Smart Volunteer Matching
- Skill-based matching  
- Availability-based recommendations  
- Geographic proximity logic  
- AI-assisted allocation

## Interactive GIS Mapping
- Map-based need visualization  
- Severity-coded pins  
- Need clustering  
- Heatmaps for critical zones

## Donation Management
- Fundraising campaigns  
- Need-linked donations  
- Progress tracking  
- Donation transparency

## Events & Shift Scheduling
- Volunteer events  
- Calendar shift registration  
- Capacity tracking  
- QR check-ins

## Volunteer Hours Tracking
- Log service hours  
- Approval workflow  
- Certificates  
- Monthly impact records

## Gamification
- Points system  
- Badges  
- Volunteer leaderboard  
- Recognition system

## Emergency Response
- Zone emergency alerts  
- Critical escalation  
- Multi-NGO collaboration  
- Emergency dashboards

## Real-Time Notifications
- Assignment alerts  
- Donation updates  
- Event reminders  
- Emergency notifications

## AI Coordination Engine — NEXUS-ALLOC
- Resource recommendations  
- Risk analysis  
- Volunteer matching support  
- Coordination insights

---

# 🛠 Tech Stack

## Frontend
```bash
Next.js
TypeScript
Tailwind CSS
shadcn/ui
Framer Motion
```

## Backend
```bash
Node.js
NextAuth
Prisma ORM
PostgreSQL (Neon)
```

## Integrations
```bash
Google OAuth
GitHub OAuth
Gemini API
Cloudinary
Razorpay
Resend
Pusher
```

## Mapping & Utilities
```bash
React Leaflet
FullCalendar
Tiptap
pdf-lib
next-pwa
```

---

# 🏗 Architecture

```text
Users
│
├── NGOs
├── Volunteers
├── Donors
└── Field Workers

        ↓

HelpConnect Platform
│
├── Authentication Layer
├── Community Needs Module
├── Volunteer Coordination Engine
├── Donation Management Module
├── GIS Mapping Layer
├── Events Scheduler
├── Notification System
└── AI Engine (NEXUS-ALLOC)

        ↓

PostgreSQL Database + External APIs
```

---

# 📂 Project Structure

```bash
helpconnect/
│
├── prisma/
├── public/
├── src/
│   ├── app/
│   │   ├── dashboard/
│   │   ├── api/
│   │   ├── auth/
│   │   └── onboarding/
│   │
│   ├── components/
│   ├── lib/
│   └── hooks/
│
└── README.md
```

---

# ⚙ Installation

Clone repository

```bash
git clone https://github.com/yourusername/helpconnect.git
cd helpconnect
```

Install dependencies

```bash
npm install
```

Run development server

```bash
npm run dev
```

---

# 🔐 Environment Variables

Create:

```bash
.env.local
```

Add:

```env
NEXTAUTH_URL=
NEXTAUTH_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

DATABASE_URL=

GEMINI_API_KEY=

CLOUDINARY_CLOUD_NAME=
RESEND_API_KEY=
RAZORPAY_KEY_ID=
```

---

# 👥 User Roles

## NGO Coordinator
- Manage needs  
- Approve volunteers  
- Create campaigns  
- Manage events

## Volunteer
- Discover tasks  
- Join events  
- Log hours  
- Earn badges

## Field Worker
- Report needs  
- Update locations  
- Support coordination

## Donor
- Fund campaigns  
- Track impact

## Admin
- Platform oversight  
- Emergency controls  
- Role management

---

# 📈 Future Scope

Potential enhancements:

- Mobile app  
- Offline-first support  
- Predictive AI allocation  
- SMS alert integration  
- Blockchain donation traceability  
- Multilingual accessibility

---

# 👨‍💻 Team

Developed by

## Core Team
- Aditya Inamke  
- Aditya Chopade  
- Janhavi Borade  
- Janvi Bajaj  

---

# 🤝 Contributing

Contributions are welcome.

1 Fork repository

```bash
git fork
```

2 Create branch

```bash
git checkout -b feature-name
```

3 Commit changes

```bash
git commit -m "Added new feature"
```

4 Push branch

```bash
git push origin feature-name
```

5 Open Pull Request

---

# 🌍 Inspiration

Inspired by ideas and coordination patterns studied from:

- CrisisCleanup  
- OpenVolunteerPlatform  
- CASA  
- Coalesce

---

# ❤️ Why HelpConnect

Helping people should not depend on disconnected systems.

This project exists to make support faster, smarter and more coordinated.

**Connect. Coordinate. Care.**

---

# 📜 License

MIT License

Feel free to use, modify, and contribute.

---

# ⭐ Support

If you like this project:

- Star the repository  
- Share feedback  
- Contribute improvements

```bash
⭐ Star this repo to support the project
```