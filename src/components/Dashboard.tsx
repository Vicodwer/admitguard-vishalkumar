import React, { useState, useEffect } from 'react';
import { LogEntry } from './AuditLog';
import { LayoutDashboard, Users, AlertTriangle, Percent, Download } from 'lucide-react';

export default function Dashboard() {
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

  const totalSubmissions = auditLogs.length;
  const flaggedEntries = auditLogs.filter(entry => entry.flagged).length;
  const entriesWithExceptions = auditLogs.filter(entry => entry.exceptionCount > 0).length;
  const exceptionRate = totalSubmissions > 0 ? (entriesWithExceptions / totalSubmissions) * 100 : 0;
  const lastFive = auditLogs.slice(0, 5);

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: 'numeric', minute: '2-digit', hour12: true
    });
  }

  const exportToCSV = () => {
    if (auditLogs.length === 0) return;

    const headers = [
      'ID', 'Timestamp', 'Full Name', 'Email', 'Phone', 'DOB', 
      'Qualification', 'Grad Year', 'Score Type', 'Score Value', 
      'Test Score', 'Interview Status', 'Aadhaar', 'Offer Sent', 
      'Exception Count', 'Flagged'
    ];

    const rows = auditLogs.map(entry => [
      entry.id,
      new Date(entry.timestamp).toLocaleString(),
      entry.candidateData.fullName,
      entry.candidateData.email,
      entry.candidateData.phone,
      entry.candidateData.dob,
      entry.candidateData.qualification,
      entry.candidateData.gradYear,
      entry.candidateData.percentageMode ? 'Percentage' : 'CGPA',
      entry.candidateData.scoreValue,
      entry.candidateData.testScore,
      entry.candidateData.interviewStatus,
      entry.candidateData.aadhaar,
      entry.candidateData.offerSent,
      entry.exceptionCount,
      entry.flagged ? 'Yes' : 'No'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(value => `"${value}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `admitguard_audit_log_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 sm:p-8 space-y-8">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <LayoutDashboard className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard Overview</h2>
        </div>
        <button 
          onClick={exportToCSV}
          disabled={auditLogs.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold"
        >
          <Download size={18} />
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Total Submissions</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalSubmissions}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-50 dark:bg-amber-900/30 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Flagged Entries</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{flaggedEntries}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg">
              <Percent className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Exception Rate</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{exceptionRate.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Submissions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-50 dark:bg-slate-700/50">
              <tr>
                <th className="text-left py-3 px-6 text-slate-600 dark:text-slate-300 font-semibold text-xs uppercase tracking-wider">Candidate</th>
                <th className="text-left py-3 px-6 text-slate-600 dark:text-slate-300 font-semibold text-xs uppercase tracking-wider">Date</th>
                <th className="text-center py-3 px-6 text-slate-600 dark:text-slate-300 font-semibold text-xs uppercase tracking-wider">Exceptions</th>
                <th className="text-center py-3 px-6 text-slate-600 dark:text-slate-300 font-semibold text-xs uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {lastFive.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-500 dark:text-slate-400">No data available</td>
                </tr>
              ) : (
                lastFive.map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="py-4 px-6 text-slate-900 dark:text-white font-medium">{entry.candidateData.fullName}</td>
                    <td className="py-4 px-6 text-slate-500 dark:text-slate-400 text-sm">{formatTimestamp(entry.timestamp)}</td>
                    <td className="py-4 px-6 text-center text-slate-900 dark:text-white">{entry.exceptionCount}</td>
                    <td className="py-4 px-6 text-center">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${entry.flagged ? 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300' : 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300'}`}>
                        {entry.flagged ? 'FLAGGED' : 'CLEAN'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
