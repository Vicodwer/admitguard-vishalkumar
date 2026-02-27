import { FormData } from './App';

export const validationRules = {
  strict: [
    {
      field: 'fullName',
      checks: [
        { type: 'required', message: 'Full Name is required.' },
        { type: 'minLength', value: 5, message: 'Must be at least 5 characters.' },
        { type: 'noNumbers', message: 'Cannot contain digits.' },
      ],
    },
    {
      field: 'email',
      checks: [
        { type: 'required', message: 'Email is required.' },
        { type: 'email', message: 'Invalid email format.' },
      ],
    },
    {
      field: 'phone',
      checks: [
        { type: 'required', message: 'Phone number is required.' },
        { type: 'indianMobile', message: 'Must be a valid 10-digit Indian mobile number.' },
      ],
    },
    {
      field: 'qualification',
      checks: [{ type: 'required', message: 'Highest Qualification is required.' }],
    },
    {
        field: 'interviewStatus',
        checks: [{ type: 'notRejected', message: 'Rejected candidates cannot be enrolled.' }]
    },
    {
      field: 'aadhaar',
      checks: [
        { type: 'required', message: 'Aadhaar Number is required.' },
        { type: 'exactLength', value: 12, message: 'Aadhaar must be exactly 12 digits.' },
        { type: 'onlyNumbers', message: 'Aadhaar must only contain numbers.' },
      ],
    },
    {
        field: 'offerSent',
        checks: [{
            type: 'conditional',
            message: 'Offer can only be sent to Cleared or Waitlisted candidates.',
            condition: (formData: FormData) => {
                return formData.offerSent === 'yes' && formData.interviewStatus !== 'Cleared' && formData.interviewStatus !== 'Waitlisted';
            }
        }]
    }
  ],
  soft: [
    {
      field: 'dob',
      checks: [
        { type: 'ageRange', min: 18, max: 35, message: (age: number) => `Age is ${age}. Must be between 18-35.` },
      ],
      exceptionAllowed: true,
      rationaleKeywords: ['approved by', 'special case', 'documentation pending', 'waiver granted'],
      rationaleMinLength: 30,
    },
    {
      field: 'gradYear',
      checks: [
        { type: 'range', min: 2015, max: 2025, message: 'Graduation year must be between 2015-2025.' },
      ],
      exceptionAllowed: true,
      rationaleKeywords: ['approved by', 'special case', 'documentation pending', 'waiver granted'],
      rationaleMinLength: 30,
    },
    {
        field: 'scoreValue',
        checks: [
            { 
                type: 'conditional', 
                message: 'Percentage must be >= 60.',
                condition: (formData: FormData, scoreType?: 'percentage' | 'cgpa') => scoreType === 'percentage' && parseFloat(formData.scoreValue) < 60
            },
            { 
                type: 'conditional', 
                message: 'CGPA must be >= 6.0.',
                condition: (formData: FormData, scoreType?: 'percentage' | 'cgpa') => scoreType === 'cgpa' && parseFloat(formData.scoreValue) < 6.0
            },
        ],
        exceptionAllowed: true,
        rationaleKeywords: ['approved by', 'special case', 'documentation pending', 'waiver granted'],
        rationaleMinLength: 30,
    },
    {
        field: 'testScore',
        checks: [
            { type: 'min', value: 40, message: 'Screening score must be >= 40.' },
        ],
        exceptionAllowed: true,
        rationaleKeywords: ['approved by', 'special case', 'documentation pending', 'waiver granted'],
        rationaleMinLength: 30,
    }
  ],
  system: {
    maxExceptionsWithoutFlag: 2,
    flagMessage: '⚠️ >2 exceptions — will be flagged for manager review',
  },
};
