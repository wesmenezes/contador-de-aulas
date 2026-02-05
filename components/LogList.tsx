
import React from 'react';
import { AttendanceLog } from '../types';
import { User, ArrowDownLeft, ArrowUpRight, Clock, Trash2 } from 'lucide-react';

interface LogListProps {
  logs: AttendanceLog[];
  onDeleteLog: (id: string) => void;
}

const LogList: React.FC<LogListProps> = ({ logs, onDeleteLog }) => {
  const formatDate = (isoStr: string) => {
    const date = new Date(isoStr);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (logs.length === 0) {
    return (
      <div className="bg-white rounded-[40px] p-24 text-center border-2 border-dashed border-slate-200">
        <Clock className="mx-auto text-slate-300 mb-6" size={56} />
        <h3 className="text-xl font-black text-wes-dark tracking-tighter">SEM ATIVIDADE</h3>
        <p className="text-wes-grey mt-2">O histórico aparecerá conforme as aulas forem realizadas.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-wes-light border-b-2 border-slate-100">
              <th className="px-8 py-6 text-xs font-black text-wes-dark uppercase tracking-widest">Aluno</th>
              <th className="px-8 py-6 text-xs font-black text-wes-dark uppercase tracking-widest">Operação</th>
              <th className="px-8 py-6 text-xs font-black text-wes-dark uppercase tracking-widest">Ajuste</th>
              <th className="px-8 py-6 text-xs font-black text-wes-dark uppercase tracking-widest">Data / Hora</th>
              <th className="px-8 py-6 text-xs font-black text-wes-dark uppercase tracking-widest text-right">Estornar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-wes-light/30 transition-colors">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-wes-dark text-white flex items-center justify-center font-black">
                      {log.studentName.charAt(0)}
                    </div>
                    <span className="font-black text-wes-dark tracking-tight">{log.studentName}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className={`inline-flex items-center gap-2 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest ${
                    log.action === 'CHECK_IN' ? 'bg-wes-dark text-white' : 'bg-wes-blue text-white'
                  }`}>
                    {log.action === 'CHECK_IN' ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                    {log.action === 'CHECK_IN' ? 'Check-in' : 'Aporte'}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <span className={`font-black text-lg ${log.adjustment < 0 ? 'text-wes-dark' : 'text-wes-blue'}`}>
                    {log.adjustment > 0 ? `+${log.adjustment}` : log.adjustment}
                  </span>
                </td>
                <td className="px-8 py-6 text-sm text-wes-grey font-bold">
                  {formatDate(log.timestamp)}
                </td>
                <td className="px-8 py-6 text-right">
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onDeleteLog(log.id);
                    }}
                    className="p-3 bg-red-500 text-white hover:bg-red-600 rounded-xl transition-all shadow-sm border border-red-600 inline-flex items-center justify-center"
                    title="Estornar esta atividade"
                  >
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LogList;
