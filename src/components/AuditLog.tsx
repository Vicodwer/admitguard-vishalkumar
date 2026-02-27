import { useState, useEffect } from 'react';

export interface LogEntry {
  id: number;
  timestamp: string;
  candidateData: any;
  exceptionCount: number;
  exceptions: { field: string; rationale: string }[];
  flagged: boolean;
}

interface AuditLogProps {
  onViewDetails: (entry: LogEntry) => void;
}

export default function AuditLog({ onViewDetails }: AuditLogProps) {
  const [auditLogs, setAuditLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    try {
      const storedLog = localStorage.getItem('admitGuardAuditLog');
      if (storedLog) {
        setAuditLogs(JSON.parse(storedLog).sort((a: LogEntry, b: LogEntry) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
      }
    } catch (error) {
      console.error('Failed to parse audit log from localStorage', error);
      setAuditLogs([]);
    }
  }, []);

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: 'numeric', minute: '2-digit', hour12: true
    });
  }

  return (
    <div className="p-6 sm:p-8">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Audit Log</h2>
      {auditLogs.length === 0 ? (
        <p className="text-slate-500 dark:text-slate-400">No submissions logged yet.</p>
      ) : (
        <div className="overflow-x-auto -mx-6 sm:-mx-8">
          <table className="min-w-full">
            <thead className="bg-slate-50 dark:bg-slate-700/50">
              <tr>
                <th className="text-left py-3 px-6 text-slate-600 dark:text-slate-300 font-semibold text-sm">Candidate Name</th>
                <th className="text-left py-3 px-6 text-slate-600 dark:text-slate-300 font-semibold text-sm">Timestamp</th>
                <th className="text-center py-3 px-6 text-slate-600 dark:text-slate-300 font-semibold text-sm">Exceptions</th>
                <th className="text-center py-3 px-6 text-slate-600 dark:text-slate-300 font-semibold text-sm">Flagged</th>
                <th className="text-left py-3 px-6 text-slate-600 dark:text-slate-300 font-semibold text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-200/80 dark:divide-slate-700/50'>
              {auditLogs.map((entry, index) => (
                <tr key={entry.id} className={`transition-colors ${index % 2 === 0 ? 'bg-white dark:bg-slate-800' : 'bg-slate-50/50 dark:bg-slate-800/50'} hover:bg-slate-100 dark:hover:bg-slate-700`}>
                  <td className="py-3 px-6 text-slate-800 dark:text-slate-200 font-medium">{entry.candidateData.fullName}</td>
                  <td className="py-3 px-6 text-slate-500 dark:text-slate-400 text-sm">{formatTimestamp(entry.timestamp)}</td>
                  <td className="py-3 px-6 text-slate-800 dark:text-slate-200 text-center font-medium">{entry.exceptionCount}</td>
                  <td className="py-3 px-6 text-center">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${entry.flagged ? 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300' : 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300'}`}>
                        {entry.flagged ? 'Yes' : 'No'}
                    </span>
                    </td>
                  <td className="py-3 px-6">
                    <button onClick={() => onViewDetails(entry)} className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-semibold">View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {auditLogs.length > 0 && (
        <div className="mt-6 flex justify-end">
          <button 
            onClick={() => {
              if (window.confirm("Are you sure you want to clear all audit logs? This is for testing only.")) {
                try {
                  localStorage.removeItem('admitGuardAuditLog');
                  setAuditLogs([]);
                  alert("Audit log cleared!");
                } catch (e) {
                  console.error("Clear failed:", e);
                }
              }
            }}
            className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-sm hover:bg-red-700 transition-colors text-sm"
          >
            Clear Log
          </button>
        </div>
      )}
    </div>
  );
}
