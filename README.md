=# AdmitGuard  
**Admission Data Validation & Compliance System**

![AdmitGuard Header](docs/wireframe.png) <!-- Optional: replace with actual screenshot or wireframe -->

**PG Diploma in AI-ML & Agentic AI Engineering**  
**IIT Gandhinagar – Week 1 Orientation Project**  
**Built: February 2026**

## Problem Statement

Futurense Technologies processes hundreds of candidates for premier programs (IITs, IIMs, etc.) using an unstructured Google Sheets/Excel tracker. Sales and operations teams manually enter data with **no validation at entry**, leading to:

- Ineligible candidates advancing to interviews and document verification  
- Wasted counselor, interviewer, and operational time  
- Damaged candidate experience from late-stage rejections  
- Compliance risks with partner institutions  
- No structured way to track valid exceptions (e.g., borderline CGPA with rationale)  
- Difficulty updating changing eligibility rules  

AdmitGuard replaces this with a lightweight, rule-enforced web form that validates data **at the point of entry**, handles soft-rule exceptions gracefully, logs every submission with an audit trail, and makes rules configurable without code changes.

## Key Features

- 11-field candidate enrollment form with real-time validation  
- **Strict rules** block invalid submissions (no override)  
- **Soft rules** show warnings + allow documented exceptions (rationale ≥30 chars + required keywords)  
- Auto-flags entries with >2 exceptions for manager review  
- Configurable rules via JSON (easy for operations team to update)  
- Audit log with timestamps, full data, exceptions, rationales, and flagged status (persisted in localStorage)  
- Clean, professional card-based UI with dark theme support  
- Client-side only – no backend required for prototype  

## Tech Stack & Tools

- **Google AI Studio – Build Mode** (Vibe Coding with Gemini) – primary development tool  
- **React** (generated frontend)  
- **JavaScript / HTML / CSS** – all client-side  
- **localStorage** – for audit log persistence across refreshes  
- **JSON-based rules engine** – fully configurable validations  
- **Deployment**: Vercel / Netlify (recommended for live demo) or GitHub Pages (static only)  

## How to Run / Demo

### Option 1: Live Demo (Recommended)
Live version hosted on Vercel:  
https://admitguard-vishal.vercel.app  
*(Update this link once deployed)*

### Option 2: From Google AI Studio
1. Open the project in Google AI Studio Build mode  
2. Use the Preview pane to interact with the form  

### Option 3: Locally from GitHub
```bash
# Clone the repo
git clone https://github.com/YOUR-USERNAME/admitguard-vishal.git
cd admitguard-vishal

# If the code includes package.json (React/Vite project)
npm install
npm start
# Opens at http://localhost:5173 or similar
