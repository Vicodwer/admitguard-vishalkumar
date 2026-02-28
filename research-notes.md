# Research Notes – Vibe Coding with Google AI Studio

## When & Why
Wednesday evening (Day 3), before the Thursday demo.  
The project brief was given before we learned the tool, so I spent time researching on my own to avoid wasting build time on Thursday.

## Sources I Read / Watched (at least 2–3 as required)

1. Official Documentation  
   - URL: https://ai.google.dev/gemini-api/docs/aistudio-build-mode  
   - Key Learnings:  
     - Build mode lets you describe apps in natural language → Gemini generates full React + Node.js code  
     - Use iterative chat: start simple (structure), then add features one by one  
     - Annotation Mode: highlight UI elements in preview and describe changes (great for polish like spacing, colors)  
     - Supports localStorage, React hooks, real-time validation  

2. Google Codelab / Tutorial  
   - URL: https://codelabs.developers.google.com/vibe-code-with-gemini-in-aistudio  
   - Key Learnings:  
     - Good prompting: be specific (field types, layout, constraints like "no external frameworks")  
     - Use "Think step by step" for complex logic (e.g., age calculation from DOB)  
     - Preview refreshes live after each prompt or annotation  

3. YouTube / Blog (Prompt Engineering for Vibe Coding)  
   - Video: "Google AI Studio Vibe Coding Full Tutorial" (~15 min, 2025–2026 upload)  
   - Blog: Medium article "Building Apps Fast with Gemini in AI Studio"  
   - Key Learnings:  
     - R.I.C.E. structure works best: Role, Intent, Constraints, Examples  
     - Avoid "kitchen sink" prompts — one feature per prompt  
     - If output is wrong, describe the bug exactly in next prompt (e.g., "Phone validation accepts letters — fix regex")  

## What I Learned & Applied
- Start with form structure (Prompt 1), then validations (Prompts 2–3), then exceptions (4–5), config (6), audit (7), polish (8)  
- Always add constraints: "clean professional design, no Bootstrap, use React hooks"  
- Annotation Mode saved time on UI tweaks (spacing, header size, modal styles)  
- localStorage is fine for prototype audit log (persists on refresh, no backend needed)  

## Questions / Challenges I Still Had
- How does AI Studio handle leap years in DOB age calc? (Had to fix manually in follow-up prompt)  
- If generated code has backend (Node.js), how to make it fully static for Vercel? (Ended up mostly client-side anyway)  

These notes helped me go from zero knowledge → working app in 2 days.  
Documented for FLC review and my own learning.
