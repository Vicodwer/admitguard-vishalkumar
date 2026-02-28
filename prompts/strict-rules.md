Now add real-time validation for these STRICT rules only (red inline errors, disable submit if any fail, no exceptions allowed):
Full Name: required, min 2 chars, no digits (use regex)
Email: valid format (contains @ and dot after)
Phone: exactly 10 digits, starts with 6,7,8,9
Highest Qualification: must be selected (not empty)
Interview Status: if "Rejected" → show red banner at top "Rejected candidates cannot be enrolled" + disable submit
Aadhaar: exactly 12 digits, only numbers
Offer Letter Sent: cannot be "Yes" if Interview Status != "Cleared" and != "Waitlisted"
Keep updating live as user types. Show green check or nothing when valid.
Test suggestion: try name "A", phone "1234567890", rejected status, etc. Fix any bugs you see.
