import React, { useState, useEffect } from 'react';
import { CheckCircle2, Sun, Moon } from 'lucide-react';
import { validationRules } from './validationRules';
import AuditLog, { LogEntry } from './components/AuditLog';
import LogDetailsModal from './components/LogDetailsModal';
import ConfirmationModal from './components/ConfirmationModal';
import Dashboard from './components/Dashboard';
import { motion, AnimatePresence } from 'framer-motion';

const QUALIFICATIONS = [
  'B.Tech',
  'B.E.',
  'B.Sc',
  'BCA',
  'M.Tech',
  'M.Sc',
  'MCA',
  'MBA',
];

const INTERVIEW_STATUSES = ['Cleared', 'Waitlisted', 'Rejected'];

type ScoreType = 'percentage' | 'cgpa';

const initialFormData = {
  fullName: '',
  email: '',
  phone: '',
  dob: '',
  qualification: '',
  gradYear: '',
  scoreValue: '',
  testScore: '',
  interviewStatus: '',
  aadhaar: '',
  offerSent: '',
};

export type FormData = typeof initialFormData;

interface ExceptionFieldProps {
    field: keyof FormData;
    softError?: string;
    exception?: boolean;
    rationale?: string;
    error?: string;
    onExceptionChange: (field: keyof FormData, isChecked: boolean) => void;
    onRationaleChange: (field: keyof FormData, value: string) => void;
}

function ExceptionField({ field, softError, exception, rationale, error, onExceptionChange, onRationaleChange }: ExceptionFieldProps) {
    if (!softError) return null;

    return (
        <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
            <p className="text-sm text-amber-800 font-medium">{softError}</p>
            <div className="mt-2">
                <label className="flex items-center gap-2 text-sm text-slate-600">
                    <input type="checkbox" checked={exception} onChange={(e) => onExceptionChange(field, e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                    Request Exception for this field
                </label>
            </div>
            {exception && (
                <div className="mt-2">
                    <textarea 
                        value={rationale || ''} 
                        onChange={(e) => onRationaleChange(field, e.target.value)} 
                        className={`form-input w-full mt-1 ${error ? 'border-red-500' : 'border-slate-300'}`} 
                        placeholder="Rationale (min 30 chars, must include keywords...)"
                        rows={3}
                    />
                    {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
                </div>
            )}
        </div>
    )
}

const RATIONALE_KEYWORDS = ['approved by', 'special case', 'documentation pending', 'waiver granted'];

type View = 'form' | 'audit' | 'dashboard';

export default function App() {
  const [scoreType, setScoreType] = useState<ScoreType>('percentage');
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [softErrors, setSoftErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormData, boolean>>>({});
  const [exceptions, setExceptions] = useState<Partial<Record<keyof FormData, boolean>>>({});
  const [rationales, setRationales] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [view, setView] = useState<View>('form');
  const [selectedLogEntry, setSelectedLogEntry] = useState<LogEntry | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const validate = () => {
      const logicErrors: Partial<Record<keyof FormData, string>> = {};
      const logicSoftErrors: Partial<Record<keyof FormData, string>> = {};

      const runChecks = (rules: any[], errorBag: Partial<Record<keyof FormData, string>>) => {
        for (const rule of rules) {
          const { field, checks } = rule;
          for (const check of checks) {
            const value = formData[field as keyof FormData];
            let hasError = false;

            switch (check.type) {
              case 'required':
                if (!value) hasError = true;
                break;
              case 'minLength':
                if (String(value).length < check.value) hasError = true;
                break;
              case 'noNumbers':
                if (/\d/.test(String(value))) hasError = true;
                break;
              case 'email':
                if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(value))) hasError = true;
                break;
              case 'indianMobile':
                if (!/^[6-9]\d{9}$/.test(String(value))) hasError = true;
                break;
              case 'notRejected':
                if (value === 'Rejected') hasError = true;
                break;
              case 'exactLength':
                if (String(value).length !== check.value) hasError = true;
                break;
              case 'onlyNumbers':
                if (!/^\d+$/.test(String(value))) hasError = true;
                break;
              case 'ageRange':
                if (value) {
                  const birthDate = new Date(String(value));
                  const today = new Date();
                  let age = today.getFullYear() - birthDate.getFullYear();
                  const m = today.getMonth() - birthDate.getMonth();
                  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
                  if (age < check.min || age > check.max) {
                    errorBag[field as keyof FormData] = check.message(age);
                  }
                } else {
                    // If ageRange is used on a required field, 'required' check should handle it.
                    // But if it's just ageRange, and it's empty, we might not want an error here
                    // unless it's required.
                }
                break;
              case 'range':
                if (value && (parseInt(String(value)) < check.min || parseInt(String(value)) > check.max)) hasError = true;
                break;
              case 'min':
                if (value && parseFloat(String(value)) < check.value) hasError = true;
                break;
              case 'conditional':
                if (check.condition(formData, scoreType)) hasError = true;
                break;
            }

            if (hasError && !errorBag[field as keyof FormData]) {
              errorBag[field as keyof FormData] = check.message;
            }
          }
        }
      }

      runChecks(validationRules.strict, logicErrors);
      runChecks(validationRules.soft, logicSoftErrors);

      // Rationale validation
      validationRules.soft.forEach(rule => {
        if (exceptions[rule.field as keyof FormData]) {
          const rationale = rationales[rule.field as keyof FormData] || '';
          if (rationale.length < rule.rationaleMinLength) {
            logicErrors[rule.field as keyof FormData] = `Rationale must be at least ${rule.rationaleMinLength} characters.`;
          } else if (!rule.rationaleKeywords.some(k => rationale.toLowerCase().includes(k))) {
            logicErrors[rule.field as keyof FormData] = `Rationale must include one of: ${rule.rationaleKeywords.join(', ')}.`;
          }
        }
      });

      // Filter errors for UI display based on 'touched'
      const uiErrors: Partial<Record<keyof FormData, string>> = {};
      const uiSoftErrors: Partial<Record<keyof FormData, string>> = {};

      Object.keys(logicErrors).forEach(key => {
        if (touched[key as keyof FormData]) {
          uiErrors[key as keyof FormData] = logicErrors[key as keyof FormData];
        }
      });

      Object.keys(logicSoftErrors).forEach(key => {
        if (touched[key as keyof FormData]) {
          uiSoftErrors[key as keyof FormData] = logicSoftErrors[key as keyof FormData];
        }
      });

      setErrors(uiErrors);
      setSoftErrors(uiSoftErrors);

      // Submit is disabled if:
      // 1. Any strict rule fails (logicErrors contains strict failures)
      // 2. Any rationale is invalid (logicErrors contains rationale failures)
      // 3. Any soft rule fails AND no exception is requested
      // 4. Interview status is Rejected
      
      const softRulesUnresolved = Object.keys(logicSoftErrors).some(field => !exceptions[field as keyof FormData]);
      const hasBlockingErrors = Object.keys(logicErrors).length > 0;
      const isRejected = formData.interviewStatus === 'Rejected';

      // Check if all required fields are touched (to avoid showing the global error message too early)
      const requiredFields = validationRules.strict.filter(r => r.checks.some(c => c.type === 'required')).map(r => r.field);
      const allRequiredTouched = requiredFields.every(f => touched[f as keyof FormData]);

      setIsSubmitDisabled(hasBlockingErrors || softRulesUnresolved || isRejected || !allRequiredTouched);
    };

    validate();
  }, [formData, touched, exceptions, rationales, scoreType]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };
  
  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setTouched(prev => ({ ...prev, [name]: true }));
  }

  const handleExceptionChange = (field: keyof FormData, isChecked: boolean) => {
    setExceptions(prev => ({ ...prev, [field]: isChecked }));
    if (!isChecked) {
        const newRationales = {...rationales};
        delete newRationales[field];
        setRationales(newRationales);
    }
  }

  const handleRationaleChange = (field: keyof FormData, value: string) => {
    setRationales(prev => ({ ...prev, [field]: value }));
  }

  const handlePreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitDisabled) return;
    setShowConfirmation(true);
  }

  const handleConfirmSubmit = () => {
    setShowConfirmation(false);

    // Exception count is correctly calculated only from fields where exception is requested AND rationale is valid
    const validExceptions = Object.entries(exceptions).filter(([field, isRequested]) => {
        if (!isRequested) return false;
        
        const rule = validationRules.soft.find(r => r.field === field);
        if (!rule) return false;

        const rationale = rationales[field as keyof FormData] || '';
        const isValidRationale = rationale.length >= rule.rationaleMinLength && 
                                 rule.rationaleKeywords.some(k => rationale.toLowerCase().includes(k));
        
        return isValidRationale;
    });

    const exceptionCount = validExceptions.length;
    const flagged = exceptionCount > validationRules.system.maxExceptionsWithoutFlag;

    const logEntry: LogEntry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      candidateData: { ...formData, percentageMode: scoreType === 'percentage' },
      exceptionCount,
      exceptions: validExceptions.map(([key]) => ({
          field: key,
          rationale: rationales[key as keyof FormData] || '',
      })),
      flagged,
    };

    try {
      const existingLog = localStorage.getItem('admitGuardAuditLog');
      const log = existingLog ? JSON.parse(existingLog) : [];
      log.push(logEntry);
      localStorage.setItem('admitGuardAuditLog', JSON.stringify(log));
    } catch (error) {
      console.error('Failed to save audit log to localStorage', error);
      alert('Error: Could not save submission to audit log.');
    }

    alert(`Submission successful!\n\nCandidate: ${formData.fullName}\nTimestamp: ${new Date(logEntry.timestamp).toLocaleString()}\nExceptions: ${exceptionCount}\nFlagged: ${flagged ? 'Yes' : 'No'}\n\nYou can view the full details in the Audit Log.`);
    
    // Reset form
    setFormData(initialFormData);
    setTouched({});
    setExceptions({});
    setRationales({});
    setScoreType('percentage');
  };

  const getInputClass = (field: keyof FormData) => {
    if (touched[field]) {
        return errors[field] ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-green-500 focus:border-green-500 focus:ring-green-500';
    }
    return 'border-slate-300';
  }

  // Exception count is correctly calculated only from fields where exception is requested AND rationale is valid
  const getValidExceptions = () => {
      return Object.entries(exceptions).filter(([field, isRequested]) => {
          if (!isRequested) return false;
          
          const rule = validationRules.soft.find(r => r.field === field);
          if (!rule) return false;

          const rationale = rationales[field as keyof FormData] || '';
          const isValidRationale = rationale.length >= rule.rationaleMinLength && 
                                   rule.rationaleKeywords.some(k => rationale.toLowerCase().includes(k));
          
          return isValidRationale;
      });
  };

  const currentExceptionCount = getValidExceptions().length;
  const isFlagged = currentExceptionCount > validationRules.system.maxExceptionsWithoutFlag;

  return (
    <div className={`${isDarkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-slate-100 dark:bg-slate-900 font-sans text-slate-800 dark:text-slate-200 flex flex-col items-center justify-start p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-5xl mx-auto">
          <div className="bg-white dark:bg-slate-800/50 rounded-2xl shadow-lg border border-slate-200/80 dark:border-slate-700/50">
            <div className="p-6 sm:p-8 border-b border-slate-200/80 dark:border-slate-700/50 flex justify-between items-center">
                <div className='text-center w-full'>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">AdmitGuard</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Admission Compliance System</p>
                </div>
                <div className='absolute top-6 right-6 flex items-center gap-4'>
                    <div className="flex items-center rounded-lg p-1 bg-slate-100 dark:bg-slate-700">
                        <button onClick={() => setView('dashboard')} className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${view === 'dashboard' ? 'bg-white dark:bg-slate-600 shadow-sm text-blue-600 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>Dashboard</button>
                        <button onClick={() => setView('form')} className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${view === 'form' ? 'bg-white dark:bg-slate-600 shadow-sm text-blue-600 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>Form</button>
                        <button onClick={() => setView('audit')} className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${view === 'audit' ? 'bg-white dark:bg-slate-600 shadow-sm text-blue-600 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>Audit Log</button>
                    </div>
                    <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                        {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={view}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {view === 'dashboard' ? (
                  <Dashboard />
                ) : view === 'form' ? (
                  <form onSubmit={handlePreSubmit} className="p-6 sm:p-8 space-y-8">
                      {formData.interviewStatus === 'Rejected' && (
                          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 text-red-700 dark:text-red-300 p-4" role="alert">
                          <p className="font-bold">Rejected candidates cannot be enrolled</p>
                          <p>The form is disabled and cannot be submitted.</p>
                          </div>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                      <div className="col-span-2">
                          <label htmlFor="fullName" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Full Name</label>
                          <div className="relative">
                          <input type="text" name="fullName" id="fullName" className={`form-input ${getInputClass('fullName')}`} onChange={handleChange} onBlur={handleBlur} value={formData.fullName} />
                          <AnimatePresence>
                            {touched.fullName && !errors.fullName && 
                                <motion.div initial={{scale:0.5, opacity: 0}} animate={{scale:1, opacity: 1}} exit={{scale:0.5, opacity: 0}} className="absolute right-3 top-1/2 -translate-y-1/2">
                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                </motion.div>}
                          </AnimatePresence>
                          </div>
                          {touched.fullName && errors.fullName && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.fullName}</p>}
                      </div>
                      <div>
                          <label htmlFor="email" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Email</label>
                          <div className="relative">
                              <input type="email" name="email" id="email" className={`form-input ${getInputClass('email')}`} onChange={handleChange} onBlur={handleBlur} value={formData.email} />
                              <AnimatePresence>
                                {touched.email && !errors.email && 
                                    <motion.div initial={{scale:0.5, opacity: 0}} animate={{scale:1, opacity: 1}} exit={{scale:0.5, opacity: 0}} className="absolute right-3 top-1/2 -translate-y-1/2">
                                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                                    </motion.div>}
                              </AnimatePresence>
                          </div>
                          {touched.email && errors.email && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.email}</p>}
                      </div>
                      <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">10-digit Indian mobile</label>
                          <div className="relative">
                              <input type="text" name="phone" id="phone" className={`form-input ${getInputClass('phone')}`} onChange={handleChange} onBlur={handleBlur} value={formData.phone} />
                              <AnimatePresence>
                                {touched.phone && !errors.phone && 
                                    <motion.div initial={{scale:0.5, opacity: 0}} animate={{scale:1, opacity: 1}} exit={{scale:0.5, opacity: 0}} className="absolute right-3 top-1/2 -translate-y-1/2">
                                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                                    </motion.div>}
                              </AnimatePresence>
                          </div>
                          {touched.phone && errors.phone && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.phone}</p>}
                      </div>
                      <div>
                          <label htmlFor="dob" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Date of Birth</label>
                          <input type="date" name="dob" id="dob" className="form-input" onChange={handleChange} onBlur={handleBlur} value={formData.dob} />
                          <ExceptionField field="dob" softError={softErrors.dob} exception={exceptions.dob} rationale={rationales.dob} onExceptionChange={handleExceptionChange} onRationaleChange={handleRationaleChange} error={errors.dob} />
                      </div>
                      <div>
                          <label htmlFor="qualification" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Highest Qualification</label>
                          <select name="qualification" id="qualification" className={`form-input ${getInputClass('qualification')}`} onChange={handleChange} onBlur={handleBlur} value={formData.qualification}>
                          <option value="" disabled>Select qualification</option>
                          {QUALIFICATIONS.map(q => <option key={q} value={q}>{q}</option>)}
                          </select>
                          {touched.qualification && errors.qualification && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.qualification}</p>}
                      </div>
                      <div>
                          <label htmlFor="gradYear" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Graduation Year</label>
                          <input type="number" name="gradYear" id="gradYear" className="form-input" onChange={handleChange} onBlur={handleBlur} value={formData.gradYear} />
                          <ExceptionField field="gradYear" softError={softErrors.gradYear} exception={exceptions.gradYear} rationale={rationales.gradYear} onExceptionChange={handleExceptionChange} onRationaleChange={handleRationaleChange} error={errors.gradYear} />
                      </div>

                      <div className="col-span-2">
                          <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Percentage or CGPA</label>
                          <div className="flex items-center gap-4">
                              <div className="flex-1">
                                  <input type="number" name="scoreValue" id="scoreValue" className="form-input" placeholder={scoreType === 'percentage' ? 'e.g. 85.5' : 'e.g. 8.5'} onChange={handleChange} onBlur={handleBlur} value={formData.scoreValue} />
                              </div>
                              <div className="flex items-center rounded-lg p-1 bg-slate-100 dark:bg-slate-700">
                                  <button type="button" onClick={() => setScoreType('percentage')} className={`px-3 py-1 text-sm rounded-md transition-colors ${scoreType === 'percentage' ? 'bg-white dark:bg-slate-600 shadow-sm text-slate-800 dark:text-white' : 'text-slate-500 dark:text-slate-300'}`}>Percentage</button>
                                  <button type="button" onClick={() => setScoreType('cgpa')} className={`px-3 py-1 text-sm rounded-md transition-colors ${scoreType === 'cgpa' ? 'bg-white dark:bg-slate-600 shadow-sm text-slate-800 dark:text-white' : 'text-slate-500 dark:text-slate-300'}`}>CGPA</button>
                              </div>
                          </div>
                          <ExceptionField field="scoreValue" softError={softErrors.scoreValue} exception={exceptions.scoreValue} rationale={rationales.scoreValue} onExceptionChange={handleExceptionChange} onRationaleChange={handleRationaleChange} error={errors.scoreValue} />
                      </div>

                      <div>
                          <label htmlFor="testScore" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Screening Test Score (0-100)</label>
                          <input type="number" name="testScore" id="testScore" className="form-input" onChange={handleChange} onBlur={handleBlur} value={formData.testScore} />
                          <ExceptionField field="testScore" softError={softErrors.testScore} exception={exceptions.testScore} rationale={rationales.testScore} onExceptionChange={handleExceptionChange} onRationaleChange={handleRationaleChange} error={errors.testScore} />
                      </div>

                      <div>
                          <label htmlFor="interviewStatus" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Interview Status</label>
                          <select name="interviewStatus" id="interviewStatus" className="form-input" onChange={handleChange} onBlur={handleBlur} value={formData.interviewStatus}>
                              <option value="" disabled>Select status</option>
                              {INTERVIEW_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                      </div>

                      <div className="col-span-2">
                          <label htmlFor="aadhaar" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Aadhaar Number</label>
                          <div className="relative">
                              <input type="text" name="aadhaar" id="aadhaar" className={`form-input ${getInputClass('aadhaar')}`} onChange={handleChange} onBlur={handleBlur} value={formData.aadhaar} />
                              <AnimatePresence>
                                {touched.aadhaar && !errors.aadhaar && 
                                    <motion.div initial={{scale:0.5, opacity: 0}} animate={{scale:1, opacity: 1}} exit={{scale:0.5, opacity: 0}} className="absolute right-3 top-1/2 -translate-y-1/2">
                                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                                    </motion.div>}
                              </AnimatePresence>
                          </div>
                          {touched.aadhaar && errors.aadhaar && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.aadhaar}</p>}
                      </div>

                      <div className="col-span-2">
                          <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Offer Letter Sent</label>
                          <div className="flex items-center gap-6 mt-2">
                              <label className="flex items-center gap-2 text-sm"><input type="radio" name="offerSent" value="yes" className="form-radio" onChange={handleRadioChange} checked={formData.offerSent === 'yes'} /> Yes</label>
                              <label className="flex items-center gap-2 text-sm"><input type="radio" name="offerSent" value="no" className="form-radio" onChange={handleRadioChange} checked={formData.offerSent === 'no'} /> No</label>
                          </div>
                          {touched.offerSent && errors.offerSent && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.offerSent}</p>}
                      </div>
                      </div>

                       <div className="pt-6 border-t border-slate-200/80 dark:border-slate-700/50">
                          {isFlagged && (
                              <div className="mb-4 bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-400 text-amber-700 dark:text-amber-300 p-4" role="alert">
                                  <p className="font-bold">{validationRules.system.flagMessage}</p>
                              </div>
                          )}

                          {isSubmitDisabled && Object.keys(touched).length > 0 && (
                              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                  <p className="text-xs text-red-700 dark:text-red-300 font-medium text-center">
                                      {formData.interviewStatus === 'Rejected' 
                                          ? "Cannot submit for rejected candidates."
                                          : "Please ensure all required fields are filled and exceptions have valid rationales (min 30 chars + keyword)."}
                                  </p>
                              </div>
                          )}

                          <div className="flex justify-between items-center">
                              <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">Active Exceptions: {currentExceptionCount}</p>
                              <button type="submit" disabled={isSubmitDisabled} className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow-md disabled:bg-slate-300 dark:disabled:bg-slate-600 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors">
                                  Submit Application
                              </button>
                          </div>
                      </div>
                  </form>
                ) : (
                  <AuditLog onViewDetails={setSelectedLogEntry} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        <AnimatePresence>
            {showConfirmation && 
                <ConfirmationModal 
                    entry={{
                        candidateData: formData,
                        exceptionCount: currentExceptionCount,
                        flagged: isFlagged
                    }}
                    onConfirm={handleConfirmSubmit}
                    onCancel={() => setShowConfirmation(false)}
                />
            }
        </AnimatePresence>
        <LogDetailsModal entry={selectedLogEntry} onClose={() => setSelectedLogEntry(null)} />
      </div>
    </div>
  );
}
