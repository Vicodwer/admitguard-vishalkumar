Now add the SOFT rules with exception system:
For DOB: calculate age from today, must be 18–35 years (show amber warning if not)
Graduation Year: 2015–2025 inclusive
Percentage: >=60 if percentage mode, >=6.0 if CGPA mode
Screening Score: >=40
When soft rule violated:
Amber warning text below field
Checkbox "Request Exception for this field"
If checked → show textarea "Rationale (min 30 chars, must include one of: 'approved by', 'special case', 'documentation pending', 'waiver granted')"
Validate rationale: <30 chars or missing keyword → red error on textarea
Valid rationale → override that rule (no warning for submit)
Display near submit: "Active Exceptions: X"
If X > 2 → show yellow banner "⚠️ >2 exceptions — will be flagged for manager review"
Submit only allowed if stricts pass AND (softs pass OR valid rationale).
