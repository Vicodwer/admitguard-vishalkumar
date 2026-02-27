import { LogEntry } from './AuditLog';

interface ConfirmationModalProps {
  entry: Partial<LogEntry>;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmationModal({ entry, onConfirm, onCancel }: ConfirmationModalProps) {
  if (!entry.candidateData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50" onClick={onCancel}>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-200/80 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Confirm Submission</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Please review the details before submitting.</p>
        </div>
        <div className="p-6 space-y-4 text-sm">
            <div className="grid grid-cols-3 gap-4">
                <p className="text-slate-500 dark:text-slate-400 col-span-1">Candidate Name</p>
                <p className="text-slate-800 dark:text-slate-200 col-span-2 font-semibold">{entry.candidateData.fullName}</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
                <p className="text-slate-500 dark:text-slate-400 col-span-1">Email</p>
                <p className="text-slate-800 dark:text-slate-200 col-span-2">{entry.candidateData.email}</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
                <p className="text-slate-500 dark:text-slate-400 col-span-1">Exceptions</p>
                <p className="text-slate-800 dark:text-slate-200 col-span-2 font-semibold">{entry.exceptionCount}</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
                <p className="text-slate-500 dark:text-slate-400 col-span-1">Flagged for Review</p>
                <p className={`col-span-2 font-semibold ${entry.flagged ? 'text-red-500' : 'text-green-600'}`}>{entry.flagged ? 'Yes' : 'No'}</p>
            </div>
        </div>
        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200/80 dark:border-slate-700 flex justify-end gap-3">
            <button onClick={onCancel} className="px-4 py-2 bg-white dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 border border-slate-300 dark:border-slate-600 text-slate-700 font-semibold rounded-lg shadow-sm hover:bg-slate-50 transition-colors text-sm">Edit</button>
            <button onClick={onConfirm} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-700 transition-colors text-sm">Confirm & Submit</button>
        </div>
      </div>
    </div>
  );
}
