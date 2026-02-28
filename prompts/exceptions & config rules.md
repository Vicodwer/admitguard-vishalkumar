You are a senior React developer refactoring this AdmitGuard admission form app for better maintainability.
We already have a working form with 11 fields, real-time strict validations (red errors), soft validations (amber warnings + exception toggles + rationale validation with keywords and min length), active exception counter, and >2 exceptions flagging.
Right now the validation logic is hardcoded inside the components or functions.
Refactor the entire validation system so ALL rules become configurable via a single JSON object placed at the top of the main file (or in a separate constant).
Create a complete rules config JSON that covers EVERY rule from the project brief:
All strict rules (name, email, phone, qualification, interview status + rejected block, aadhaar, offer letter dependency)
All soft rules (dob age 18-35, graduation year 2015-2025, percentage >=60 or cgpa >=6.0, screening >=40)
For soft rules: include "exceptionAllowed": true, and for each the required "rationaleKeywords": ["approved by", "special case", "documentation pending", "waiver granted"]
Include appropriate error/warning messages
For computed/system rules like exception count >2, add a top-level "systemRules" array or object
Example structure you should follow and expand to cover all fields:
const validationRules = {
"strict": [
{
"field": "fullName",
"checks": [
{ "type": "required", "message": "Full Name is required" },
{ "type": "minLength", "value": 2, "message": "Minimum 2 characters" },
{ "type": "noNumbers", "message": "No numbers allowed in name" }
]
},
// ... other strict fields
],
"soft": [
{
"field": "dob",
"checks": [
{ "type": "ageRange", "min": 18, "max": 35, "message": "Age must be 18-35 years" }
],
"exceptionAllowed": true,
"rationaleKeywords": ["approved by", "special case", "documentation pending", "waiver granted"],
"rationaleMinLength": 30
},
// ... other soft fields like graduationYear, percentageOrCgpa, screeningScore
],
"system": {
"maxExceptionsWithoutFlag": 2,
"flagMessage": "⚠️ This candidate has more than 2 exceptions. Entry will be flagged for manager review."
}
};
Now refactor the form logic:
Read ALL validations from this JSON config instead of hardcoded if/else or switch statements.
Make sure the same behavior is preserved: strict block submit, soft show warning + toggle + rationale validation.
The operations team should be able to change rules (e.g. age to 18-40, percentage to 55) by only editing the JSON — no code changes needed.
Keep the UI exactly the same.
After refactoring, show the full new validationRules JSON object, explain how the validation function now uses it (step-by-step), and confirm in the preview that changing one rule in JSON (you simulate it) updates behavior without breaking anything.
If any part breaks during refactor, fix it automatically.
