# AdmitGuard – Architecture & Data Flow

## Overview
AdmitGuard is a **client-side only** single-page React application built with Google AI Studio Vibe Coding.  
No backend server is used (meets prototype constraints). All logic runs in the browser.

Key principles:
- Real-time validation at data entry
- Configurable rules (no code changes needed)
- Persistent audit trail via browser storage
- Lightweight (<3s load, desktop-focused)

## High-Level Components
- **App / Main Entry**: Handles tab switching (Form ↔ Audit Log), theme toggle (if added)
- **CandidateForm**: Renders 11 input fields, real-time validation, exception toggles, submit handler
- **ValidationEngine**: Reads from `config/rules.json` → applies strict/soft/system rules
- **AuditLogView**: Table of past submissions, details modal, clear button
- **localStorage**: Key = "admitGuardAuditLog" → JSON array of log entries

## Data Flow Diagram (Text Representation)
User Interaction
│
▼
[Form Inputs] ──► onChange / onBlur Events
│
▼
[Validation Engine]
├─ Reads config/rules.json
├─ Strict Rules ──► Red inline errors + disable Submit
├─ Soft Rules ──► Amber warnings + Exception Checkbox + Rationale Textarea
│                 └─ Validate rationale (length + keywords)
└─ System Rules ──► Exception Counter + >2 Flag Banner
│
▼
Submit Button (enabled only if stricts pass + softs valid or excepted)
│
▼
[On Submit Success]
├─ Collect form data + exceptions + flagged status
├─ Create log entry {id, timestamp, candidateData, exceptionCount, exceptions[], flagged}
└─ Append to localStorage "admitGuardAuditLog" array
│
▼
[Success Modal / Reset Form]
│
▼
Audit Log Tab ──► useEffect: Load from localStorage on mount
Display table (sorted newest first)
View Details Modal → full entry data
Clear Log → confirm → removeItem() + clear state
text## Key Flows Explained

1. **Real-time Validation**  
   - Every keystroke/selection → ValidationEngine checks field against rules.json  
   - Strict fail → red error + disable submit  
   - Soft fail → amber warning + show toggle → valid rationale overrides  

2. **Submission & Logging**  
   - Submit → if valid → build log entry → JSON.stringify + localStorage.setItem  
   - Reset form, show success  

3. **Audit Persistence**  
   - On load (useEffect) → parse localStorage → populate table state  
   - Clear → window.confirm → localStorage.removeItem → set state []  

4. **Configurability**  
   - All rules (messages, thresholds, keywords) in rules.json  
   - Change age 18–35 to 18–40 → behavior updates without code change  

## Tech Decisions & Trade-offs
- Client-side only → fast, no deploy complexity, but data per-browser only  
- localStorage → simple persistence, survives refresh, ~5–10MB limit (fine for prototype)  
- React hooks (useState, useEffect) → manage form state, log loading  
- No external libs → keeps lightweight (AI Studio generated vanilla React)  

This architecture ensures the app is maintainable, testable, and directly addresses the business problem: early validation + auditable exceptions.

(You can turn this text diagram into a visual one in Excalidraw: boxes + arrows matching the fl
