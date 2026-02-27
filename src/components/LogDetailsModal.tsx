import { LogEntry } from './AuditLog';

interface LogDetailsModalProps {
  entry: LogEntry | null;
  onClose: () => void;
}

export default function LogDetailsModal({ entry, onClose }: LogDetailsModalProps) {
  if (!entry) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-200/80 sticky top-0 bg-white">
          <h3 className="text-lg font-bold text-slate-900">Submission Details</h3>
          <p className="text-sm text-slate-500">Submitted on {new Date(entry.timestamp).toLocaleString()}</p>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <h4 className="font-semibold text-slate-800 mb-2">Candidate Data</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm bg-slate-50 p-4 rounded-lg">
              {Object.entries(entry.candidateData).map(([key, value]) => (
                <div key={key}>
                  <span className="font-medium text-slate-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}: </span>
                  <span className="text-slate-800">{String(value) || 'N/A'}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-slate-800 mb-2">Exceptions ({entry.exceptionCount})</h4>
            {entry.exceptions.length > 0 ? (
              <ul className="space-y-2 bg-amber-50 p-4 rounded-lg">
                {entry.exceptions.map(ex => (
                  <li key={ex.field}>
                    <p className="font-medium text-amber-900 capitalize">{ex.field.replace(/([A-Z])/g, ' $1')}</p>
                    <p className="text-sm text-amber-800 pl-2 border-l-2 border-amber-300 ml-2 mt-1">{ex.rationale}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500 bg-slate-50 p-4 rounded-lg">No exceptions were requested for this submission.</p>
            )}
          </div>
           <div className="font-semibold text-slate-800">
            Flagged for Review: <span className={entry.flagged ? 'text-red-600 font-bold' : 'text-green-600 font-bold'}>{entry.flagged ? 'Yes' : 'No'}</span>
           </div>
        </div>
        <div className="p-4 bg-slate-50 border-t border-slate-200/80 flex justify-end">
            <button onClick={onClose} className="px-4 py-2 bg-slate-600 text-white font-semibold rounded-lg shadow-sm hover:bg-slate-700 transition-colors text-sm">Close</button>
        </div>
      </div>
    </div>
  );
}
