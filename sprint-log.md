# Sprint Log — AdmitGuard  
Admission Data Validation & Compliance System

## Sprint 0 (Day 3 – Wednesday PM + Evening)
- **Goal**: Understand problem deeply, plan approach, research tools, set up repo  
- **Done**:  
  - Read full project brief, annotated key rules & requirements  
  - Created GitHub repo: admitguard-vishal  
  - Set up folder structure (prompts/, src/, config/, docs/)  
  - Sketched wireframe in Excalidraw → exported as docs/wireframe.png  
  - Researched Google AI Studio Build mode (docs, codelab, 1 video + 1 blog)  
  - Drafted first 3 prompts on paper (foundation, strict, edge cases)  
- **Research**: See research-notes.md  
- **Blockers**: None – tool access on Thursday, but planning saved time  
- **Key Decision**: Single-page card layout (fast load, simple UX)  
- **Commits**: 1 (sprint-0: project setup and planning docs)

## Sprint 1 (Day 4 – Thursday PM + Evening)
- **Goal**: Working form + strict validations  
- **Done**:  
  - Prompt 1: Base form with 11 fields, clean card layout  
  - Prompt 2: Added strict rules (name, email, phone, qualification, interview status block, aadhaar, offer letter dependency)  
  - Prompt 3: Edge case testing & fixes (short name, invalid phone, rejected + offer Yes, etc.)  
  - Inline red errors, submit disabled until stricts pass  
- **Blockers**: Initial dropdown missing options – fixed with follow-up prompt  
- **Key Decision**: Real-time onChange validation instead of submit-time only  
- **Prompts Used**: 1–3  
- **Commits**: 3 (base form, strict rules, edge cases)

## Sprint 2 (Day 5 – Friday AM)
- **Goal**: Soft rules + exception system  
- **Done**:  
  - Prompt 4: Soft rules (DOB age, grad year, %/CGPA, screening) with amber warnings, exception toggles, rationale validation (min 30 chars + keywords)  
  - Prompt 5: Active exceptions counter + >2 flag banner  
- **Blockers**: Rationale not blocking submit if invalid – added extra validation check  
- **Key Decision**: Keep strict red / soft amber / valid green for clear visual hierarchy  
- **Prompts Used**: 4–5  
- **Commits**: 2 (soft rules & exceptions, counter + flagging)

## Sprint 3 (Day 5 – Friday PM)
- **Goal**: Configurable rules + audit log + UI polish  
- **Done**:  
  - Prompt 6: Refactored all validations to read from rules.json (strict, soft, system)  
  - Prompt 7: Audit log with localStorage (timestamp, data, exceptions, flagged), table view, details modal, clear log  
  - Prompt 8: UI polish via Annotation Mode (header, spacing, pre-submit modal, subtle animations, table stripes)  
  - Fixed bugs: clear log not working, flagged logic on >2 exceptions  
- **Blockers**: localStorage parse error on corrupt data – added try/catch  
- **Key Decision**: Client-side only (localStorage) meets prototype reqs perfectly  
- **Prompts Used**: 6–8 + several follow-ups  
- **Commits**: 4 (config refactor, audit log, bug fixes, UI polish)

## Sprint 4 (Day 5 Evening + Day 6 Morning)
- **Goal**: Presentation prep & final polish  
- **Done**:  
  - Added live Vercel deployment link  
  - Updated README.md with overview, setup, demo link  
  - Prepared 5-min presentation deck (problem → solution → demo → tech → prompts)  
  - Rehearsed timing (under 5 min)  
  - Final edge case testing (boundaries, invalid rationales, refresh persistence)  
- **Blockers**: None  
- **Key Decision**: Vercel for live demo (better than AI Studio preview for panel)  
- **Commits**: 2–3 (README, deployment, final docs)

Total commits: ~12  
All Must-Have FR-1–7 + Should-Have FR-8–9 completed.  
Ready for FLC presentation on Saturday.
